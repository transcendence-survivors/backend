import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
	Min,
	ValidateNested,
} from 'class-validator';

export class GameWeaponDto {
	@ApiProperty({
		description: "Catégorie de l'arme",
		enum: GameWeaponKind,
		example: GameWeaponKind.SWORD,
	})
	@IsEnum(GameWeaponKind)
	kind!: GameWeaponKind;

	@ApiProperty({
		description: "Niveau atteint par l'arme dans la partie",
		example: 5,
		minimum: 1,
	})
	@IsInt()
	@Min(1)
	level!: number;
}

export class GamePlayerStatsDto {
	@ApiPropertyOptional({
		description:
			"ID de l'utilisateur (optionnel pour les invités ou comptes supprimés)",
		example: 'usr_123456789',
		nullable: true,
	})
	@IsString()
	userId!: string;

	@ApiProperty({ description: 'Santé maximale atteinte', example: 150 })
	@IsInt()
	maxHealth!: number;

	@ApiProperty({ description: "Vitesse d'attaque", example: 1.25 })
	@IsNumber({ maxDecimalPlaces: 2 })
	attackSpeed!: number;

	@ApiProperty({ description: 'Vitesse de déplacement', example: 5.5 })
	@IsNumber({ maxDecimalPlaces: 2 })
	moveSpeed!: number;

	@ApiProperty({ description: 'Armure', example: 20 })
	@IsInt()
	armor!: number;

	@ApiProperty({ description: "Dégâts d'attaque", example: 45 })
	@IsInt()
	attackDamage!: number;

	@ApiProperty({ description: 'Statistique de chance', example: 1.1 })
	@IsNumber({ maxDecimalPlaces: 2 })
	luck!: number;

	@ApiProperty({ description: 'Nombre de kills individuels', example: 128 })
	@IsInt()
	killAmount!: number;

	@ApiProperty({ description: 'Vol de vie (%)', example: 0.05 })
	@IsNumber({ maxDecimalPlaces: 2 })
	lifesteal!: number;

	@ApiProperty({ description: "Portée d'attaque", example: 2.5 })
	@IsNumber({ maxDecimalPlaces: 2 })
	range!: number;

	@ApiProperty({ description: 'Taille des attaques (Zone)', example: 1.2 })
	@IsNumber({ maxDecimalPlaces: 2 })
	size!: number;

	@ApiProperty({ description: 'Durée des effets', example: 1.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	duration!: number;

	@ApiProperty({
		description: 'Quantité de projectiles/attaques',
		example: 3,
	})
	@IsInt()
	quantity!: number;

	@ApiProperty({ description: "Pénétration d'armure", example: 0.15 })
	@IsNumber({ maxDecimalPlaces: 2 })
	penetration!: number;

	@ApiProperty({
		description: 'Armes équipées durant la partie (1 à 3)',
		type: [GameWeaponDto],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(3)
	@ValidateNested({ each: true })
	@Type(() => GameWeaponDto)
	weapons!: GameWeaponDto[];
}

export class CreateGameStatsDto {
	@ApiProperty({
		description: 'Temps de survie total de la partie en secondes',
		example: 480,
	})
	@IsInt()
	survivalTime!: number;

	@ApiProperty({
		description: 'Statistiques de chaque joueur présent (1 à 4 joueurs)',
		type: [GamePlayerStatsDto],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(4)
	@ValidateNested({ each: true })
	@Type(() => GamePlayerStatsDto)
	players!: GamePlayerStatsDto[];
}
