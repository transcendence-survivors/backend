import {
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsInt,
	IsPositive,
	IsIn,
	Min,
	IsEnum,
	isNotEmpty,
} from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class NameDto {
	@MaxLength(42)
	@MinLength(1)
	@IsString()
	@IsNotEmpty()
	name: string;
}

export class PositiveInt {
	@IsPositive()
	@IsInt()
	wins: number;

	@IsPositive()
	@IsInt()
	loses: number;

	@IsPositive()
	@IsInt()
	kills: number;
}

export class PaginationDto {
	@Min(1)
	@IsInt()
	@IsNotEmpty()
	@Type(() => Number)
	page: number;

	@IsIn([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
	@IsInt()
	@IsNotEmpty()
	@Type(() => Number)
	size: number;
}

enum Weapons {
	SWORD = 'sword',
	AXE = 'axe',
	HAMMER = 'hammer',
	CLAYMORE = 'claymore',
	SPEAR = 'spear',
	DAGGER = 'dagger',
	BOW = 'bow',
	CROSSBOW = 'crossbow',
	NUKE = 'nuke',
}

export class FavWeaponDto {
	@IsEnum(Weapons)
	@MinLength(1)
	@IsString()
	@IsNotEmpty()
	weapon: string;
}

export class CreatePlayerDto extends IntersectionType(NameDto) {}

export class EditPlayerDto extends IntersectionType(
	NameDto,
	PositiveInt,
	FavWeaponDto,
) {}
