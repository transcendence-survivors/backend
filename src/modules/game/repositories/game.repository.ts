import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateGameStatsDto } from '../dtos/requests/create-game-stats.dto.ts';
import { DbContext } from '@/core/database/uow/db-context.js';
import { UpsertUserSummaryParams } from '../types/params/user-summary.params.js';
import { UpsertWeaponParams } from '../types/params/weapon.params.js';
import { GameWeaponKind } from '@prisma-generated/enums.js';
import { UserSummaryWithWeapons } from '../types/records/user-summary-with-weapons.type.js';
import { UserGameSummarySelect } from '@prisma-generated/models.js';

@Injectable()
export class GameRepository {
	constructor(private readonly prisma: PrismaService) {}

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

	async findUserSummary(
		userId: string,
		ctx?: DbContext,
	): Promise<UserSummaryWithWeapons | null> {
		const client = ctx?.client ?? this.prisma;
		return client.userGameSummary.findUnique({
			where: { userId },
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
