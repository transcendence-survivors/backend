import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';

@Exclude()
export class GamePlayerStatsListItemResponseDto {
	@ApiProperty({
		description: 'Unique player stats ID',
		example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'Number of kills achieved by this player',
		example: 284,
	})
	@Expose()
	killAmount!: number;

	@ApiPropertyOptional({
		type: UserListItemResponseDto,
		description: 'User associated with the player',
		nullable: true,
	})
	@Type(() => UserListItemResponseDto)
	@Expose()
	user!: UserListItemResponseDto | null;
}

@Exclude()
export class GameStatsListItemResponseDto {
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
		type: [GamePlayerStatsListItemResponseDto],
		description: 'Summary player list for the match',
	})
	@Type(() => GamePlayerStatsListItemResponseDto)
	@Expose()
	players!: GamePlayerStatsListItemResponseDto[];
}

@Exclude()
export class GameStatsPaginatedListResponseDto extends CursorPaginationResultDto<GameStatsListItemResponseDto> {
	@ApiProperty({
		type: [GameStatsListItemResponseDto],
		description: 'List of game stats',
	})
	@Expose()
	@Type(() => GameStatsListItemResponseDto)
	declare data: GameStatsListItemResponseDto[];
}
