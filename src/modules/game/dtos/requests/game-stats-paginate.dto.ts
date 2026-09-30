import { IsCursor, IsCursorLimit } from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GameStatsOrderByEnum } from '../../types/enums/game-stats-order-by.enum';

export class GameStatsPaginateDto {
	@ApiProperty({
		description: 'The maximum number of game stats to return',
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
		enum: GameStatsOrderByEnum,
		example: GameStatsOrderByEnum['created-desc'],
	})
	@IsOptional()
	@IsEnum(GameStatsOrderByEnum)
	orderBy: GameStatsOrderByEnum = GameStatsOrderByEnum['created-desc'];

	@ApiPropertyOptional({
		description: 'Filter game stats by a specific player username',
		example: 'johndoe',
		type: String,
	})
	@IsOptional()
	@IsString()
	username?: string;
}
