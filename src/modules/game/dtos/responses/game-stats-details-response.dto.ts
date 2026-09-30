import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameWeaponKind } from '@prisma-generated/enums';
import { Expose, Type } from 'class-transformer';

export class GamePlayerWeaponStatsResponseDto {
	@ApiProperty({
		description: 'Unique weapon stat ID',
		example: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3011',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		enum: GameWeaponKind,
		description: 'Weapon type',
		example: GameWeaponKind.SWORD,
	})
	@Expose()
	kind!: GameWeaponKind;

	@ApiProperty({
		description: 'Level reached by the weapon during the match',
		example: 5,
	})
	@Expose()
	level!: number;
}

export class GamePlayerStatsResponseDto {
	@ApiProperty({
		description: 'Unique player stats ID',
		example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({ description: 'Maximum health points', example: 120 })
	@Expose()
	maxHealth!: number;

	@ApiProperty({
		description: 'Attack speed multiplier',
		example: 1.25,
	})
	@Expose()
	attackSpeed!: number;

	@ApiProperty({ description: 'Movement speed', example: 350.0 })
	@Expose()
	moveSpeed!: number;

	@ApiProperty({ description: 'Base attack damage', example: 45 })
	@Expose()
	attackDamage!: number;

	@ApiProperty({ description: 'Armor rating', example: 10 })
	@Expose()
	armor!: number;

	@ApiProperty({ description: 'Luck stat', example: 1.1 })
	@Expose()
	luck!: number;

	@ApiProperty({
		description: 'Number of kills achieved by this player',
		example: 284,
	})
	@Expose()
	killAmount!: number;

	@ApiProperty({ description: 'Lifesteal percentage', example: 0.05 })
	@Expose()
	lifesteal!: number;

	@ApiProperty({ description: 'Attack range', example: 1.0 })
	@Expose()
	range!: number;

	@ApiProperty({
		description: 'Attack size / Area of effect',
		example: 1.15,
	})
	@Expose()
	size!: number;

	@ApiProperty({ description: 'Effect duration', example: 2.5 })
	@Expose()
	duration!: number;

	@ApiProperty({
		description: 'Additional projectiles or summons quantity',
		example: 1,
	})
	@Expose()
	quantity!: number;

	@ApiProperty({ description: 'Projectile penetration', example: 0.2 })
	@Expose()
	penetration!: number;

	@ApiProperty({
		type: [GamePlayerWeaponStatsResponseDto],
		description: 'List of weapons equipped by the player',
	})
	@Type(() => GamePlayerWeaponStatsResponseDto)
	@Expose()
	weapons!: GamePlayerWeaponStatsResponseDto[];

	@ApiPropertyOptional({
		type: UserListItemResponseDto,
		description: 'User associated with the player',
		nullable: true,
	})
	@Type(() => UserListItemResponseDto)
	@Expose()
	user!: UserListItemResponseDto | null;
}

export class GameStatsDetailsResponseDto {
	@ApiProperty({
		description: 'Unique match ID',
		example: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'Total match survival time in seconds',
		example: 1245,
	})
	@Expose()
	survivalTime!: number;

	@ApiProperty({
		description: 'Total accumulated kills in the match',
		example: 850,
	})
	@Expose()
	totalKills!: number;

	@ApiProperty({
		description: 'Match creation timestamp',
		example: '2026-09-30T14:20:00.000Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: [GamePlayerStatsResponseDto],
		description: 'Individual stats for all players in the match',
	})
	@Type(() => GamePlayerStatsResponseDto)
	@Expose()
	players!: GamePlayerStatsResponseDto[];
}
