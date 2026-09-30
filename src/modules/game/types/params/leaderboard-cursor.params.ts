import { LeaderboardOrderByEnum } from '../enums/leaderboard-order-by.enum';

export type LeaderboardCursorParams = {
	limit: number;
	cursor?: string;
	orderBy: LeaderboardOrderByEnum;
};
