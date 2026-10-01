import { Injectable } from '@nestjs/common';
import { GameRepository } from '../repositories/game.repository';
import {
	CreateGameStatsDto,
	GamePlayerStatsDto,
} from '../dtos/requests/create-game-stats.dto.ts';
import {
	GameInvalidPlayersCountException,
	GameUserNotFoundException,
} from '../exceptions/game-bad.exceptions';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_EVENTS } from '@/contracts/events/internal';
import { GameCreatedEvent } from '@/contracts/events/internal/game/game-created.event';
import { UnitOfWork } from '@/core/database/uow/unit-of-work';
import { DbContext } from '@/core/database/uow/db-context';
import { UpdateUserSummaryParams } from '../types/params/user-summary.params';
import { UserGameSummaryResponseDto } from '../dtos/responses/user-game-summary-response.dto';
import { GameMapper } from '../mappers/game.mapper';
import {
	GameStatsNotFoundException,
	UserGameSummaryNotFoundException,
} from '../exceptions/game-not-found.exceptions';
import { GameStatsDetailsResponseDto } from '../dtos/responses/game-stats-details-response.dto';
import { GameStatsPaginateDto } from '../dtos/requests/game-stats-paginate.dto';
import { GameStatsPaginatedListResponseDto } from '../dtos/responses/game-stats-paginated-list-response.dto';
import { CursorService } from '@/shared/services/cursor.service';
import { LeaderboardPaginateDto } from '../dtos/requests/leaderboard-paginate.dto.';
import { LeaderboardPaginatedListResponseDto } from '../dtos/responses/leaderboard-paginated-list-response.dto';

@Injectable()
export class GameService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: GameRepository,
		private readonly mapper: GameMapper,
		private readonly eventEmitter: EventEmitter2,
		private readonly cursor: CursorService,
		private readonly uow: UnitOfWork,
	) {}

	async listGames(
		dto: GameStatsPaginateDto,
	): Promise<GameStatsPaginatedListResponseDto> {
		const gameStatsList = await this.repo.cursorGames({
			limit: dto.limit,
			cursor: dto.cursor,
			orderBy: dto.orderBy,
			username: dto.username,
		});

		const dtos = this.mapper.toListItemDtoList(gameStatsList);
		const result = this.cursor.create(dtos, dto.limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}

	async listLeaderboard(
		dto: LeaderboardPaginateDto,
	): Promise<LeaderboardPaginatedListResponseDto> {
		const leaderboardList = await this.repo.cursorLeaderboard({
			limit: dto.limit,
			cursor: dto.cursor,
			orderBy: dto.orderBy,
		});

		const dtos = this.mapper.toLeaderboardItemDtoList(leaderboardList);
		const result = this.cursor.create(dtos, dto.limit, (item) => item.id);
		return this.mapper.toLeaderboardPaginatedListDto(result);
	}

	async getGameStatsDetails(
		id: string,
	): Promise<GameStatsDetailsResponseDto> {
		const gameStats = await this.repo.findGameStatsById(id);
		if (!gameStats) throw new GameStatsNotFoundException();

		return this.mapper.toGameStatsDetailsResponseDto(gameStats);
	}

	async getUserSummary(
		username: string,
	): Promise<UserGameSummaryResponseDto> {
		const summary = await this.repo.findUserSummaryByUsername(username);
		if (!summary) throw new UserGameSummaryNotFoundException();

		return this.mapper.toUserSummaryResponseDto(summary);
	}

	async recordGame(dto: CreateGameStatsDto): Promise<{ gameId: string }> {
		const uniqueUserIds = [...new Set(dto.players.map((p) => p.userId))];
		if (uniqueUserIds.length !== dto.players.length) {
			throw new GameInvalidPlayersCountException();
		}

		const existingUsersCount =
			await this.userService.getCountIn(uniqueUserIds);
		if (existingUsersCount !== uniqueUserIds.length) {
			throw new GameUserNotFoundException();
		}

		const gameStats = await this.repo.createGameSession(dto);
		this.eventEmitter.emit(
			APP_EVENTS.GAME_CREATED,
			new GameCreatedEvent(gameStats.id, dto),
		);

		return { gameId: gameStats.id };
	}

	async processGameStatsAggregation(
		survivalTime: number,
		players: CreateGameStatsDto['players'],
	): Promise<void> {
		await Promise.all(
			players.map((player) => {
				if (!player.userId) return Promise.resolve();
				return this.aggregatePlayerStats(
					player.userId,
					survivalTime,
					player,
				);
			}),
		);
	}

	private async aggregatePlayerStats(
		userId: string,
		survivalTime: number,
		playerData: GamePlayerStatsDto,
	): Promise<void> {
		await this.uow.run(async (ctx: DbContext) => {
			const summary = await this.updateUserSummary(
				{
					userId,
					survivalTime,
					killAmount: playerData.killAmount,
				},
				ctx,
			);

			await this.updateUserWeapons(summary.id, playerData.weapons, ctx);
			await this.updateUserTomes(summary.id, playerData.tomes, ctx);
		});
	}
	private async updateUserSummary(
		params: UpdateUserSummaryParams,
		ctx: DbContext,
	) {
		const existingSummary = await this.repo.findUserSummaryByUserId(
			params.userId,
			ctx,
		);

		const currentBestSurvival = existingSummary?.highestSurvivalTime ?? 0;
		const currentBestKills = existingSummary?.highestKills ?? 0;

		return this.repo.upsertUserSummary(
			{
				...params,
				newHighestSurvival: Math.max(
					currentBestSurvival,
					params.survivalTime,
				),
				newHighestKills: Math.max(currentBestKills, params.killAmount),
			},
			ctx,
		);
	}

	private async updateUserWeapons(
		userGameSummaryId: string,
		weapons: GamePlayerStatsDto['weapons'],
		ctx: DbContext,
	): Promise<void> {
		if (!weapons.length) return;

		const kinds = weapons.map((w) => w.kind);
		const existingWeapons = await this.repo.findWeaponSummaries(
			{ userGameSummaryId, kinds },
			ctx,
		);

		const existingWeaponMap = new Map(
			existingWeapons.map((w) => [w.kind, w.highestLevel]),
		);

		await Promise.all(
			weapons.map((weapon) => {
				const currentHighestLevel =
					existingWeaponMap.get(weapon.kind) ?? 0;

				return this.repo.upsertWeaponSummary(
					{
						userGameSummaryId,
						kind: weapon.kind,
						level: weapon.level,
						newHighestLevel: Math.max(
							currentHighestLevel,
							weapon.level,
						),
					},
					ctx,
				);
			}),
		);
	}

	private async updateUserTomes(
		userGameSummaryId: string,
		tomes: GamePlayerStatsDto['tomes'],
		ctx: DbContext,
	): Promise<void> {
		if (!tomes.length) return;

		const kinds = tomes.map((t) => t.kind);
		const existingTomes = await this.repo.findTomeSummaries(
			{ userGameSummaryId, kinds },
			ctx,
		);

		const existingTomesMap = new Map(
			existingTomes.map((t) => [t.kind, t.highestLevel]),
		);

		await Promise.all(
			tomes.map((tome) => {
				const currentHighestLevel =
					existingTomesMap.get(tome.kind) ?? 0;

				return this.repo.upsertTomeSummary(
					{
						userGameSummaryId,
						kind: tome.kind,
						level: tome.level,
						newHighestLevel: Math.max(
							currentHighestLevel,
							tome.level,
						),
					},
					ctx,
				);
			}),
		);
	}
}
