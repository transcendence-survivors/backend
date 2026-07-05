import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { BlockOrderByEnum } from '../../types/enums/block-order-by.enum';

export class BlockPaginateDto {
	@IsCursorLimit({})
	limit: number = 20;

	@IsCursor()
	cursor?: string;

	@IsOptional()
	@IsEnum(BlockOrderByEnum)
	orderBy: BlockOrderByEnum = BlockOrderByEnum['date-desc'];

	@IsSearch({})
	search?: string;
}
