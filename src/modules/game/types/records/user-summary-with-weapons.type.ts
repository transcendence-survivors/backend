import {
	UserGameSummary,
	UserGameWeaponSummary,
} from '@prisma-generated/client';

export type UserSummaryWithWeapons = Pick<
	UserGameSummary,
	| 'id'
	| 'userId'
	| 'totalGamesPlayed'
	| 'totalKills'
	| 'totalSurvivalTime'
	| 'highestSurvivalTime'
	| 'highestKills'
	| 'lastPlayedAt'
> & {
	weaponSummaries: Pick<
		UserGameWeaponSummary,
		'kind' | 'timesUsed' | 'highestLevel'
	>[];
};
