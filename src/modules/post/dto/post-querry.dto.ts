import { IsIn, IsOptional, IsString } from 'class-validator';
import { IsPaginationLimit } from '@/shared/decorators/pagination.decorators';
import {
	POST_ORDER_BY,
	type PostOrderBy,
} from '../repositories/post.repository';

export class PostQueryDto {
	@IsPaginationLimit({})
	limit: number = 20;

	@IsOptional()
	@IsString()
	cursor?: string;

	@IsOptional()
	@IsIn(POST_ORDER_BY)
	orderBy: PostOrderBy = 'date-desc';

	@IsOptional()
	@IsString()
	search?: string;
}
