import { Injectable } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_EVENTS } from '@/contracts/events/internal';
import { GameCreatedEvent } from '@/contracts/events/internal/game/game-created.event';

@Injectable()
export class GameListener {
	constructor(private readonly service: GameService) {}

	@OnEvent(APP_EVENTS.GAME_CREATED, { async: true })
	async handleGameCreatedEvent(event: GameCreatedEvent): Promise<void> {
		await this.service.processGameStatsAggregation(
			event.dto.survivalTime,
			event.dto.players,
		);
	}
}
