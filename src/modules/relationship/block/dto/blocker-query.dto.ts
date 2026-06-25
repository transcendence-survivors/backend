import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import { IsIn, IsOptional } from 'class-validator';
import {
	BLOCK_ORDER_BY,
	type BlockOrderBy,
} from '../repositories/block.repository';

class BlockQueryDto {
	@IsPaginationLimit({})
	limit: number = 20;

	@IsPaginationPage()
	page: number = 1;

	@IsOptional()
	@IsIn(BLOCK_ORDER_BY)
	orderBy: BlockOrderBy = 'createdDesc';

	@IsOptional()
	username?: string;
}

export { BlockQueryDto };
