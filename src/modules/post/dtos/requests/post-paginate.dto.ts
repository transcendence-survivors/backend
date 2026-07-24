import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PostOrderByEnum } from '../../types/enums/post-order-by.enum';

export class PostPaginateDto {
	@ApiProperty({
		description: 'The maximum number of posts to return',
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
		enum: PostOrderByEnum,
		example: PostOrderByEnum['date-desc'],
	})
	@IsOptional()
	@IsEnum(PostOrderByEnum)
	orderBy: PostOrderByEnum = PostOrderByEnum['date-desc'];

	@IsSearch({})
	search?: string;
}
