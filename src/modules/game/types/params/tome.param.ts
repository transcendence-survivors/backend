import { GameTomeKind } from '@prisma-generated/enums';

export interface UpdateTomeParams {
	userGameSummaryId: string;
	kind: GameTomeKind;
	level: number;
}

export interface UpsertTomeParams extends UpdateTomeParams {
	newHighestLevel: number;
}
