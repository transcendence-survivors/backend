import { GameWeaponKind } from '@prisma-generated/enums';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
	IsString,
	ValidateNested,
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

	@IsNumber({ maxDecimalPlaces: 2 })
	luck!: number;

	@IsInt()
	killAmount!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	lifesteal!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	range!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	size!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	duration!: number;

	@IsInt()
	quantity!: number;

	@IsNumber({ maxDecimalPlaces: 2 })
	penetration!: number;

	@IsArray()
	@ArrayMaxSize(3)
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => GameWeaponDto)
	weapons!: GameWeaponDto[];

	@IsString()
	userId!: string;
}

export class GameStatsDto {
	@IsInt()
	survivalTime!: number;

	@IsArray()
	@ArrayMaxSize(4)
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => GamePlayerStatsDto)
	players!: GamePlayerStatsDto[];
}
