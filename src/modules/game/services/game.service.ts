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
import { UserGameSummaryNotFoundException } from '../exceptions/game-not-found.exceptions';

@Injectable()
export class GameService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: GameRepository,
		private readonly mapper: GameMapper,
		private readonly eventEmitter: EventEmitter2,
		private readonly uow: UnitOfWork,
	) {}

	async getUserSummary(userId: string): Promise<UserGameSummaryResponseDto> {
		const summary = await this.repo.findUserSummary(userId);
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
		});
	}
	private async updateUserSummary(
		params: UpdateUserSummaryParams,
		ctx: DbContext,
	) {
		const existingSummary = await this.repo.findUserSummary(
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
}
