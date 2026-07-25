import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PostListItemResponseDto } from './post-list-item-response.dto';

@Exclude()
export class PostPaginatedListResponseDto extends CursorPaginationResultDto<PostListItemResponseDto> {
	@ApiProperty({
		type: [PostListItemResponseDto],
		description: 'List of posts',
	})
	@Expose()
	@Type(() => PostListItemResponseDto)
	declare data: PostListItemResponseDto[];
}
