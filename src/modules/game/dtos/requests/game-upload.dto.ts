import { GameWeaponKind } from '@prisma-generated/enums';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
} from 'class-validator';

class GameWeaponDto {
	@IsInt()
	level!: number;

	@IsEnum(GameWeaponKind)
	kind!: GameWeaponKind;
}

class GamePlayerStatsDto {
	@IsInt()
	maxHealth!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	attackSpeed!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	moveSpeed!: number;

	@IsInt()
	armor!: number;

	@IsInt()
	attackDamage!: number;

	@IsInt()
	luck!: number;

	@IsInt()
	killAmount!: number;

	@IsInt()
	lifesteal!: number;

	@IsInt()
	range!: number;

	@IsInt()
	size!: number;

	@IsInt()
	duration!: number;

	@IsInt()
	quantity!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	penetration!: number;

	@IsArray()
	@ArrayMaxSize(3)
	@ArrayMinSize(1)
	@Type(() => GameWeaponDto)
	weapons!: GameWeaponDto[];
}

export class GameStatsDto {
	@IsInt()
	survivalTime!: number;

	@IsArray()
	@ArrayMaxSize(4)
	@ArrayMinSize(1)
	@Type(() => GamePlayerStatsDto)
	playerStats!: GamePlayerStatsDto;
}
