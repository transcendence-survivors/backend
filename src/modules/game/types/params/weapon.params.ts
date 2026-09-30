import { GameWeaponKind } from '@prisma-generated/enums';

export interface UpdateWeaponParams {
	userGameSummaryId: string;
	kind: GameWeaponKind;
	level: number;
}

export interface UpsertWeaponParams extends UpdateWeaponParams {
	newHighestLevel: number;
}
