import { UserListItem } from '@/modules/user/user.public-api';
import { UserGameSummary } from '@prisma-generated/browser';

export type LeaderboardPreview = Pick<
	UserGameSummary,
	| 'id'
	| 'totalGamesPlayed'
	| 'totalKills'
	| 'totalSurvivalTime'
	| 'highestSurvivalTime'
	| 'highestKills'
> & {
	user: UserListItem | null;
};
