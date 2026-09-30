export interface UpdateUserSummaryParams {
	userId: string;
	survivalTime: number;
	killAmount: number;
}

export interface UpsertUserSummaryParams extends UpdateUserSummaryParams {
	newHighestSurvival: number;
	newHighestKills: number;
}
