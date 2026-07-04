import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { BlockOrderBy } from '../repositories/block.repository';

class BlockCursorQueryDto {
	@IsCursorLimit({})
	limit: number = 20;

	@IsCursor()
	cursor?: string;

	@IsOptional()
	@IsEnum(BlockOrderBy)
	orderBy: BlockOrderBy = BlockOrderBy['date-desc'];

	@IsSearch({})
	search?: string;
}

class BlockCountQueryDto {
	@IsOptional()
	search?: string;
}

export { BlockCursorQueryDto, BlockCountQueryDto };
