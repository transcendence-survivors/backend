import { IsCursorLimit } from '@/shared/decorators/cursor.decorators';
import { IsIn, IsOptional, IsString } from 'class-validator';
import {
	COMMENT_ORDER_BY,
	type CommentOrderBy,
} from '../repositories/comment.repository';

export class CommentQueryDto {
	@IsCursorLimit({})
	limit: number = 20;

	@IsOptional()
	@IsString()
	cursor?: string;

	@IsOptional()
	@IsIn(COMMENT_ORDER_BY)
	orderBy: CommentOrderBy = 'date-desc';
}
