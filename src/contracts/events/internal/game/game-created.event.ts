import { CreateGameStatsDto } from '@/modules/game/dtos/requests/create-game-stats.dto.ts';

export class GameCreatedEvent {
	constructor(
		public readonly gameId: string,
		public readonly dto: CreateGameStatsDto,
	) {}
}
