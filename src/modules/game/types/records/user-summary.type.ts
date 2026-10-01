import {
	UserGameSummary,
	UserGameTomeSummary,
	UserGameWeaponSummary,
} from '@prisma-generated/client';

export type UserSummary = Pick<
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
	tomeSummaries: Pick<
		UserGameTomeSummary,
		'kind' | 'timesUsed' | 'highestLevel'
	>[];
};
