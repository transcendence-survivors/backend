import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { PostCreateDto } from '../dtos/requests/post-create.dto';
import { PostOwnershipException } from '../exceptions/post-unauthorized.exception.';
import { PostDoesNotExistException } from '../exceptions/post-unexisting.exception';
import { PostPaginateDto } from '../dtos/requests/post-paginate.dto';
import { StorageService } from '@/core/storage/services/storage.service';
import { CursorService } from '@/shared/services/cursor.service';
import { LikeRepository } from '@/modules/like/repositories/like.repository';
import { RepostRepository } from '@/modules/repost/repositories/repost.repositories';
import { PostMapper } from '../mappers/post.mapper';
import { PostListItem } from '../types/records/post-list-item.type';
import { PostListItemResponseDto } from '../dtos/responses/post-list-item-response.dto';
import { PostPaginatedListResponseDto } from '../dtos/responses/post-paginated-list-response.dto';
import { PostCreatedResponseDto } from '../dtos/responses/post-created-response.dto';

@Injectable()
export class PostService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly likeRepository: LikeRepository,
		private readonly repostRepository: RepostRepository,
		private readonly cursor: CursorService,
		private readonly storageService: StorageService,
		private readonly mapper: PostMapper,
	) {}

	/**
	 * Resolves, for the current viewer, which of the given posts they already
	 * liked and reposted. Anonymous viewers get empty sets.
	 */
	private async viewerInteractions(
		postIds: string[],
		viewerId?: string,
	): Promise<{ liked: ReadonlySet<string>; reposted: ReadonlySet<string> }> {
		if (!viewerId || postIds.length === 0)
			return { liked: new Set(), reposted: new Set() };

		const [likedIds, repostedIds] = await Promise.all([
			this.likeRepository.findLikedPostIds(viewerId, postIds),
			this.repostRepository.findRepostedPostIds(viewerId, postIds),
		]);

		return { liked: new Set(likedIds), reposted: new Set(repostedIds) };
	}

	private async toPaginatedListDto(
		posts: PostListItem[],
		limit: number,
		viewerId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const { liked, reposted } = await this.viewerInteractions(
			posts.map((post) => post.id),
			viewerId,
		);

		const dtos = this.mapper.toListItemDtoList(posts, liked, reposted);
		const result = this.cursor.create(dtos, limit, (item) => item.id);
		return this.mapper.toPaginatedListDto(result);
	}

	async findCursor(
		query: PostPaginateDto,
		viewerId?: string,
		parentPostId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const excludeUserId = parentPostId ? undefined : viewerId;
		const posts = await this.postRepository.cursor(
			parentPostId ?? null,
			query,
			excludeUserId,
		);

		return this.toPaginatedListDto(posts, query.limit, viewerId);
	}

	async findUserComments(
		authorId: string,
		query: PostPaginateDto,
		viewerId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const posts = await this.postRepository.findUserComments(
			authorId,
			query,
		);

		return this.toPaginatedListDto(posts, query.limit, viewerId);
	}

	async findUserReposts(
		authorId: string,
		query: PostPaginateDto,
		viewerId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const posts = await this.postRepository.findUserReposts(
			authorId,
			query,
		);

		return this.toPaginatedListDto(posts, query.limit, viewerId);
	}

	async findUserLikes(
		userId: string,
		query: PostPaginateDto,
		viewerId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const posts = await this.postRepository.findUserLikes(userId, query);

		return this.toPaginatedListDto(posts, query.limit, viewerId);
	}

	async findUserPosts(
		authorId: string,
		query: PostPaginateDto,
		viewerId?: string,
	): Promise<PostPaginatedListResponseDto> {
		const posts = await this.postRepository.findUserPosts(authorId, query);

		return this.toPaginatedListDto(posts, query.limit, viewerId);
	}

	findAll() {
		return this.postRepository.findAll();
	}

	async findOne(
		postId: string,
		viewerId?: string,
	): Promise<PostListItemResponseDto> {
		const post = await this.postRepository.findByIdWithDetails(postId);
		if (!post) throw new PostDoesNotExistException();

		const { liked, reposted } = await this.viewerInteractions(
			[postId],
			viewerId,
		);

		return this.mapper.toListItemDto(post, liked, reposted);
	}

	async create(
		userId: string,
		dto: PostCreateDto,
		imageUrl?: string,
		parentPostId?: string,
		quotedPostId?: string,
	): Promise<PostCreatedResponseDto> {
		const post = await this.postRepository.create(
			userId,
			dto,
			imageUrl,
			parentPostId,
			quotedPostId,
		);

		return this.mapper.toCreatedDto(post);
	}

	async delete(postId: string, userId: string): Promise<void> {
		const found = await this.postRepository.findById(postId);
		if (!found) throw new PostDoesNotExistException();
		if (found.authorId !== userId) throw new PostOwnershipException();
		if (found.imageUrl) {
			await this.storageService.delete(found.imageUrl);
		}
		await this.postRepository.delete(postId);
	}
}
