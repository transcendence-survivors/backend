import { UserListItem } from '@/modules/user/user.public-api';
import { GamePlayerStats, GameStats } from '@prisma-generated/browser';

export type GamePlayerStatsListItem = Pick<
	GamePlayerStats,
	'id' | 'killAmount'
> & {
	user: UserListItem | null;
};

export type GameStatsListItem = Pick<
	GameStats,
	'id' | 'survivalTime' | 'totalKills' | 'createdAt'
> & {
	players: GamePlayerStatsListItem[];
};
