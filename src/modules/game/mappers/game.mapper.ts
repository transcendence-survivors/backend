import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserGameSummaryResponseDto } from '../dtos/responses/user-game-summary-response.dto';
import { UserSummaryWithWeapons } from '../types/records/user-summary-with-weapons.type';
import {
	GamePlayerStatsResponseDto,
	GamePlayerWeaponStatsResponseDto,
	GameStatsDetailsResponseDto,
} from '../dtos/responses/game-stats-details-response.dto';
import {
	GamePlayerStatsDetails,
	GamePlayerWeaponStatsDetails,
	GameStatsDetails,
} from '../types/records/game-stats-details.types';
import {
	GameStatsListItemResponseDto,
	GameStatsPaginatedListResponseDto,
} from '../dtos/responses/game-stats-paginated-list-response.dto';
import { GameStatsListItem } from '../types/records/game-stats-list-item.types';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { LeaderboardPreview } from '../types/records/leaderboard-preview.types';
import {
	LeaderboardItemResponseDto,
	LeaderboardPaginatedListResponseDto,
} from '../dtos/responses/leaderboard-paginated-list-response.dto';
import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';

@Injectable()
export class GameMapper {
	toUserSummaryResponseDto(
		summary: UserSummaryWithWeapons,
	): UserGameSummaryResponseDto {
		return plainToInstance(UserGameSummaryResponseDto, summary, {
			excludeExtraneousValues: true,
		});
	}

	toGameStatsDetailsResponseDto(
		entity: GameStatsDetails,
	): GameStatsDetailsResponseDto {
		return plainToInstance(
			GameStatsDetailsResponseDto,
			{
				id: entity.id,
				survivalTime: entity.survivalTime,
				totalKills: entity.totalKills,
				createdAt: entity.createdAt,
				players: entity.players.map((player) =>
					this.toGamePlayerStatsResponseDto(player),
				),
			},
			{ excludeExtraneousValues: true },
		);
	}

	private toGamePlayerStatsResponseDto(
		player: GamePlayerStatsDetails,
	): GamePlayerStatsResponseDto {
		return plainToInstance(
			GamePlayerStatsResponseDto,
			{
				id: player.id,
				maxHealth: player.maxHealth,
				attackSpeed: player.attackSpeed,
				moveSpeed: player.moveSpeed,
				attackDamage: player.attackDamage,
				armor: player.armor,
				luck: player.luck,
				killAmount: player.killAmount,
				lifesteal: player.lifesteal,
				range: player.range,
				size: player.size,
				duration: player.duration,
				quantity: player.quantity,
				penetration: player.penetration,
				weapons: player.weapons.map((weapon) =>
					this.toGamePlayerWeaponStatsResponseDto(weapon),
				),
				user: {
					id: player.user?.id ?? null,
					username: player.user?.username ?? null,
					avatarUrl: player.user?.avatarUrl ?? null,
					displayName: player.user?.displayName ?? null,
				},
			},
			{ excludeExtraneousValues: true },
		);
	}

	private toGamePlayerWeaponStatsResponseDto(
		weapon: GamePlayerWeaponStatsDetails,
	): GamePlayerWeaponStatsResponseDto {
		return plainToInstance(
			GamePlayerWeaponStatsResponseDto,
			{
				id: weapon.id,
				kind: weapon.kind,
				level: weapon.level,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toPaginatedListDto(
		paginationGames: CursorPaginationResult<GameStatsListItemResponseDto>,
	): GameStatsPaginatedListResponseDto {
		return plainToInstance(
			GameStatsPaginatedListResponseDto,
			paginationGames,
			{
				excludeExtraneousValues: true,
			},
		);
	}

	toListItemDtoList(
		entities: GameStatsListItem[],
	): GameStatsListItemResponseDto[] {
		return entities.map((entity) =>
			this.toGameStatsListItemResponseDto(entity),
		);
	}

	private toGameStatsListItemResponseDto(
		entity: GameStatsListItem,
	): GameStatsListItemResponseDto {
		return plainToInstance(
			GameStatsListItemResponseDto,
			{
				id: entity.id,
				survivalTime: entity.survivalTime,
				totalKills: entity.totalKills,
				createdAt: entity.createdAt,
				players: entity.players.map((player) => ({
					id: player.id,
					killAmount: player.killAmount,
					user: {
						id: player.user?.id ?? null,
						username: player.user?.username ?? null,
						avatarUrl: player.user?.avatarUrl ?? null,
						displayName: player.user?.displayName ?? null,
					},
				})),
			},
			{ excludeExtraneousValues: true },
		);
	}

	private toLeaderboardItemDto(
		item: LeaderboardPreview,
	): LeaderboardItemResponseDto {
		return {
			id: item.id,
			totalGamesPlayed: item.totalGamesPlayed,
			totalKills: item.totalKills,
			totalSurvivalTime: item.totalSurvivalTime,
			highestSurvivalTime: item.highestSurvivalTime,
			highestKills: item.highestKills,
			user: item.user,
		};
	}

	toLeaderboardItemDtoList(
		items: LeaderboardPreview[],
	): LeaderboardItemResponseDto[] {
		return items.map((item) => this.toLeaderboardItemDto(item));
	}

	toLeaderboardPaginatedListDto(
		result: CursorPaginationResultDto<LeaderboardItemResponseDto>,
	): LeaderboardPaginatedListResponseDto {
		return plainToInstance(LeaderboardPaginatedListResponseDto, result, {
			excludeExtraneousValues: true,
		});
	}
}
