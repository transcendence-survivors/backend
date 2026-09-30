import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';

@Exclude()
export class LeaderboardItemResponseDto {
	@ApiProperty({
		description: 'Unique summary ID',
		example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'Total number of games played',
		example: 142,
	})
	@Expose()
	totalGamesPlayed!: number;

	@ApiProperty({
		description: 'Total kills accumulated',
		example: 5420,
	})
	@Expose()
	totalKills!: number;

	@ApiProperty({
		description: 'Total survival time in seconds',
		example: 85200,
	})
	@Expose()
	totalSurvivalTime!: number;

	@ApiProperty({
		description: 'Best survival time in seconds',
		example: 1850,
	})
	@Expose()
	highestSurvivalTime!: number;

	@ApiProperty({
		description: 'Highest kill count achieved in a single match',
		example: 320,
	})
	@Expose()
	highestKills!: number;

	@ApiPropertyOptional({
		type: UserListItemResponseDto,
		description: 'User associated with the summary',
		nullable: true,
	})
	@Type(() => UserListItemResponseDto)
	@Expose()
	user!: UserListItemResponseDto | null;
}

@Exclude()
export class LeaderboardPaginatedListResponseDto extends CursorPaginationResultDto<LeaderboardItemResponseDto> {
	@ApiProperty({
		type: [LeaderboardItemResponseDto],
		description: 'List of leaderboard entries',
	})
	@Expose()
	@Type(() => LeaderboardItemResponseDto)
	declare data: LeaderboardItemResponseDto[];
}
