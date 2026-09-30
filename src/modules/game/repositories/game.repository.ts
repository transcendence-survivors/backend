import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateGameStatsDto } from '../dtos/requests/create-game-stats.dto.ts';
import { DbContext } from '@/core/database/uow/db-context.js';
import { UpsertUserSummaryParams } from '../types/params/user-summary.params.js';
import { UpsertWeaponParams } from '../types/params/weapon.params.js';
import { GameWeaponKind } from '@prisma-generated/enums.js';
import { UserSummaryWithWeapons } from '../types/records/user-summary-with-weapons.type.js';
import {
	GameStatsSelect,
	UserGameSummarySelect,
} from '@prisma-generated/models.js';
import { GameStatsDetails } from '../types/records/game-stats-details.types.js';
import { GameStatsCursorParams } from '../types/params/game-stats-cursor.params.js';
import { GameStatsListItem } from '../types/records/game-stats-list-item.types.js';
import { GameQueryHelper } from './game-query.helper.js';
import { LeaderboardCursorParams } from '../types/params/leaderboard-cursor.params.js';
import { LeaderboardPreview } from '../types/records/leaderboard-preview.types.js';

@Injectable()
export class GameRepository {
	constructor(private readonly prisma: PrismaService) {}

	cursorGames(
		{ limit, cursor, orderBy, username }: GameStatsCursorParams,
		ctx?: DbContext,
	): Promise<GameStatsListItem[]> {
		const client = ctx?.client ?? this.prisma;

		return client.gameStats.findMany({
			...GameQueryHelper.pagination(limit, cursor),
			where: username ? GameQueryHelper.userWhere(username) : {},
			orderBy: GameQueryHelper.gameOrderBy[orderBy],
			select: {
				id: true,
				survivalTime: true,
				totalKills: true,
				createdAt: true,
				players: {
					select: {
						id: true,
						killAmount: true,
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
								displayName: true,
							},
						},
					},
				},
			} satisfies Record<
				keyof GameStatsListItem,
				GameStatsSelect[keyof GameStatsListItem]
			>,
		});
	}

	cursorLeaderboard({
		limit,
		cursor,
		orderBy,
	}: LeaderboardCursorParams): Promise<LeaderboardPreview[]> {
		return this.prisma.userGameSummary.findMany({
			...GameQueryHelper.pagination(limit, cursor),
			orderBy: GameQueryHelper.leaderboardOrderBy[orderBy],
			select: {
				id: true,
				totalGamesPlayed: true,
				totalKills: true,
				totalSurvivalTime: true,
				highestSurvivalTime: true,
				highestKills: true,
				user: {
					select: {
						id: true,
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
			} satisfies Record<
				keyof LeaderboardPreview,
				UserGameSummarySelect[keyof LeaderboardPreview]
			>,
		});
	}

	createGameSession(
		dto: CreateGameStatsDto,
		ctx?: DbContext,
	): Promise<{ id: string }> {
		const totalMatchKills = dto.players.reduce(
			(acc, player) => acc + player.killAmount,
			0,
		);

		return (ctx?.client ?? this.prisma).gameStats.create({
			data: {
				survivalTime: dto.survivalTime,
				totalKills: totalMatchKills,
				players: {
					create: dto.players.map((player) => ({
						userId: player.userId ?? null,
						maxHealth: player.maxHealth,
						attackSpeed: player.attackSpeed,
						moveSpeed: player.moveSpeed,
						armor: player.armor,
						attackDamage: player.attackDamage,
						luck: player.luck,
						killAmount: player.killAmount,
						lifesteal: player.lifesteal,
						range: player.range,
						size: player.size,
						duration: player.duration,
						quantity: player.quantity,
						penetration: player.penetration,
						weapons: {
							create: player.weapons.map((weapon) => ({
								kind: weapon.kind,
								level: weapon.level,
							})),
						},
					})),
				},
			},
			select: {
				id: true,
			},
		});
	}

	findGameStatsById(
		id: string,
		ctx?: DbContext,
	): Promise<GameStatsDetails | null> {
		const client = ctx?.client ?? this.prisma;

		return client.gameStats.findUnique({
			where: { id },
			select: {
				id: true,
				survivalTime: true,
				totalKills: true,
				createdAt: true,
				players: {
					select: {
						id: true,
						maxHealth: true,
						attackSpeed: true,
						moveSpeed: true,
						attackDamage: true,
						armor: true,
						luck: true,
						killAmount: true,
						lifesteal: true,
						range: true,
						size: true,
						duration: true,
						quantity: true,
						penetration: true,
						weapons: {
							select: {
								id: true,
								kind: true,
								level: true,
							},
						},
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
								displayName: true,
							},
						},
					},
				},
			} satisfies Record<
				keyof GameStatsDetails,
				GameStatsSelect[keyof GameStatsDetails]
			>,
		});
	}

	async findUserSummaryByUsername(
		username: string,
		ctx?: DbContext,
	): Promise<UserSummaryWithWeapons | null> {
		const client = ctx?.client ?? this.prisma;
		return client.userGameSummary.findFirst({
			where: {
				user: {
					username: {
						equals: username,
						mode: 'insensitive',
					},
				},
			},
			select: {
				id: true,
				userId: true,
				totalGamesPlayed: true,
				totalKills: true,
				totalSurvivalTime: true,
				highestSurvivalTime: true,
				highestKills: true,
				lastPlayedAt: true,
				weaponSummaries: {
					select: {
						kind: true,
						timesUsed: true,
						highestLevel: true,
					},
					orderBy: {
						timesUsed: 'desc',
					},
				},
			} satisfies Record<
				keyof UserSummaryWithWeapons,
				UserGameSummarySelect[keyof UserSummaryWithWeapons]
			>,
		});
	}

	upsertUserSummary(
		{
			userId,
			survivalTime,
			killAmount,
			newHighestSurvival,
			newHighestKills,
		}: UpsertUserSummaryParams,
		ctx: DbContext,
	) {
		return (ctx?.client ?? this.prisma).userGameSummary.upsert({
			where: { userId },
			create: {
				userId,
				totalGamesPlayed: 1,
				totalKills: killAmount,
				totalSurvivalTime: survivalTime,
				highestSurvivalTime: survivalTime,
				highestKills: killAmount,
				lastPlayedAt: new Date(),
			},
			update: {
				totalGamesPlayed: { increment: 1 },
				totalKills: { increment: killAmount },
				totalSurvivalTime: { increment: survivalTime },
				highestSurvivalTime: newHighestSurvival,
				highestKills: newHighestKills,
				lastPlayedAt: new Date(),
			},
		});
	}

	async findWeaponSummaries(
		params: { userGameSummaryId: string; kinds: GameWeaponKind[] },
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.userGameWeaponSummary.findMany({
			where: {
				userGameSummaryId: params.userGameSummaryId,
				kind: { in: params.kinds },
			},
		});
	}

	async findUserSummaryByUserId(userId: string, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.userGameSummary.findFirst({
			where: {
				userId,
			},
			select: {
				id: true,
				totalGamesPlayed: true,
				totalKills: true,
				totalSurvivalTime: true,
				highestSurvivalTime: true,
				highestKills: true,
			},
		});
	}

	async upsertWeaponSummary(
		{ userGameSummaryId, kind, level, newHighestLevel }: UpsertWeaponParams,
		ctx: DbContext,
	) {
		return (ctx?.client ?? this.prisma).userGameWeaponSummary.upsert({
			where: {
				userGameSummaryId_kind: {
					userGameSummaryId,
					kind,
				},
			},
			create: {
				userGameSummaryId,
				kind,
				timesUsed: 1,
				highestLevel: level,
			},
			update: {
				timesUsed: { increment: 1 },
				highestLevel: newHighestLevel,
			},
		});
	}
}
