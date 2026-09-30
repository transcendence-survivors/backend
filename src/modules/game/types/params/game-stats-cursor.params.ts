import { GameStatsOrderByEnum } from '../enums/game-stats-order-by.enum';

export type GameStatsCursorParams = {
	limit: number;
	cursor?: string;
	orderBy: GameStatsOrderByEnum;
	username?: string;
};
