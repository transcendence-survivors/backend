import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { BlockOrderByEnum } from '../../types/enums/block-order-by.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BlockPaginateDto {
	@ApiProperty({
		description: 'The maximum number of items to return',
		example: 20,
		type: Number,
	})
	@IsCursorLimit({})
	limit: number = 20;

	@ApiProperty({
		description: 'The cursor to start the pagination from',
		type: String,
	})
	@IsOptional()
	@IsCursor()
	cursor?: string;

	@ApiPropertyOptional({
		description: 'The order in which to sort the results',
		enum: BlockOrderByEnum,
		example: BlockOrderByEnum['date-desc'],
	})
	@IsOptional()
	@IsEnum(BlockOrderByEnum)
	orderBy: BlockOrderByEnum = BlockOrderByEnum['date-desc'];

	@ApiPropertyOptional({
		description: 'The username or display name to filter the results by',
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;
}
