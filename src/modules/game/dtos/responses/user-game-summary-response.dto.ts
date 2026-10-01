import { GameWeaponKind } from '@prisma-generated/enums';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class UserGameWeaponSummaryResponseDto {
	@Expose()
	kind!: GameWeaponKind;

	@Expose()
	timesUsed!: number;

	@Expose()
	highestLevel!: number;
}

@Exclude()
class UserGameTomeSummaryResponseDto {
	@Expose()
	kind!: GameWeaponKind;

	@Expose()
	timesUsed!: number;

	@Expose()
	highestLevel!: number;
}

@Exclude()
export class UserGameSummaryResponseDto {
	@Expose()
	id!: string;

	@Expose()
	userId!: string;

	@Expose()
	totalGamesPlayed!: number;

	@Expose()
	totalKills!: number;

	@Expose()
	totalSurvivalTime!: number;

	@Expose()
	highestSurvivalTime!: number;

	@Expose()
	highestKills!: number;

	@Expose()
	lastPlayedAt!: Date;

	@Expose()
	@Type(() => UserGameWeaponSummaryResponseDto)
	weaponSummaries!: UserGameWeaponSummaryResponseDto[];

	@Expose()
	@Type(() => UserGameTomeSummaryResponseDto)
	tomeSummaries!: UserGameTomeSummaryResponseDto[];
}
