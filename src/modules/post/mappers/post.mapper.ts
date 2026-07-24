import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@prisma-generated/client';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { PostListItem } from '../types/records/post-list-item.type';
import { PostListItemResponseDto } from '../dtos/responses/post-list-item-response.dto';
import { PostPaginatedListResponseDto } from '../dtos/responses/post-paginated-list-response.dto';
import { PostCreatedResponseDto } from '../dtos/responses/post-created-response.dto';

/**
 * Turns the raw records coming from the repository into the response DTOs
 * exposed by the controllers. Nothing else in the module is allowed to leak
 * a Prisma shape to the outside world.
 */
@Injectable()
export class PostMapper {
	toListItemDto(
		post: PostListItem,
		likedPostIds: ReadonlySet<string>,
		repostedPostIds: ReadonlySet<string>,
	): PostListItemResponseDto {
		return plainToInstance(
			PostListItemResponseDto,
			{
				...post,
				likeCount: post._count.likes,
				commentCount: post._count.replies,
				repostCount: post._count.reposts,
				isLiked: likedPostIds.has(post.id),
				isReposted: repostedPostIds.has(post.id),
			},
			{ excludeExtraneousValues: true },
		);
	}

	toListItemDtoList(
		posts: PostListItem[],
		likedPostIds: ReadonlySet<string>,
		repostedPostIds: ReadonlySet<string>,
	): PostListItemResponseDto[] {
		return posts.map((post) =>
			this.toListItemDto(post, likedPostIds, repostedPostIds),
		);
	}

	toPaginatedListDto(
		paginatedPosts: CursorPaginationResult<PostListItemResponseDto>,
	): PostPaginatedListResponseDto {
		return plainToInstance(PostPaginatedListResponseDto, paginatedPosts, {
			excludeExtraneousValues: true,
		});
	}

	toCreatedDto(post: Post): PostCreatedResponseDto {
		return plainToInstance(PostCreatedResponseDto, post, {
			excludeExtraneousValues: true,
		});
	}
}
