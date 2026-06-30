import { IsIn, IsOptional } from 'class-validator';
import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import type { OrderBy } from '../repositories/post.repository';
import { POST_ORDER_BY } from '../repositories/post.repository';

export class PostQueryDto {
	@IsPaginationPage()
	page: number = 1;

	@IsPaginationLimit({})
	limit: number = 20;

	@IsOptional()
	@IsIn(POST_ORDER_BY)
	orderBy?: OrderBy;
}
