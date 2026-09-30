import {
	GameStatsOrderByWithRelationInput,
	GameStatsWhereInput,
	UserGameSummaryOrderByWithRelationInput,
} from '@prisma-generated/models';
import { GameStatsOrderByEnum } from '../types/enums/game-stats-order-by.enum';
import { LeaderboardOrderByEnum } from '../types/enums/leaderboard-order-by.enum';

export class GameQueryHelper {
	public static readonly gameOrderBy: Record<
		GameStatsOrderByEnum,
		GameStatsOrderByWithRelationInput
	> = {
		'created-asc': { createdAt: 'asc' },
		'created-desc': { createdAt: 'desc' },
		'survival-asc': { survivalTime: 'asc' },
		'survival-desc': { survivalTime: 'desc' },
		'kills-asc': { totalKills: 'asc' },
		'kills-desc': { totalKills: 'desc' },
	};

	public static readonly leaderboardOrderBy: Record<
		LeaderboardOrderByEnum,
		UserGameSummaryOrderByWithRelationInput[]
	> = {
		'highest-kills-desc': [{ highestKills: 'desc' }, { id: 'desc' }],
		'highest-survival-desc': [
			{ highestSurvivalTime: 'desc' },
			{ id: 'desc' },
		],
		'total-kills-desc': [{ totalKills: 'desc' }, { id: 'desc' }],
		'total-games-desc': [{ totalGamesPlayed: 'desc' }, { id: 'desc' }],
	};

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	static userWhere(username: string): GameStatsWhereInput {
		return {
			players: {
				some: {
					user: {
						username: {
							equals: username,
							mode: 'insensitive',
						},
					},
				},
			},
		};
	}
}
