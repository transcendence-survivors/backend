import { IsCursor, IsCursorLimit } from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { LeaderboardOrderByEnum } from '../../types/enums/leaderboard-order-by.enum';

export class LeaderboardPaginateDto {
	@ApiProperty({
		description: 'The maximum number of leaderboard items to return',
		example: 20,
		type: Number,
	})
	@IsCursorLimit({})
	limit: number = 20;

	@ApiPropertyOptional({
		description: 'The cursor to start the pagination from',
		type: String,
	})
	@IsCursor()
	cursor?: string;

	@ApiPropertyOptional({
		description: 'The order in which to sort the results',
		enum: LeaderboardOrderByEnum,
		example: LeaderboardOrderByEnum['highest-kills-desc'],
	})
	@IsOptional()
	@IsEnum(LeaderboardOrderByEnum)
	orderBy: LeaderboardOrderByEnum =
		LeaderboardOrderByEnum['highest-kills-desc'];
}
