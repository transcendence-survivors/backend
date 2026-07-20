import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/post.dto';
import { PostOwnershipException } from '../exceptions/post-unauthorized.exception.';
import { PostDoesNotExistException } from '../exceptions/post-unexisting.exception';
import { PostQueryDto } from '../dto/post-query.dto';
import { StorageService } from '@/core/storage/services/storage.service';
import { CursorService } from '@/shared/services/cursor.service';
import { LikeRepository } from '@/modules/like/repositories/like.repository';

@Injectable()
export class PostService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly likeRepository: LikeRepository,
		private readonly cursor: CursorService,
		private readonly storageService: StorageService,
	) {}

	async findCursor(
		query: PostQueryDto,
		userId?: string,
		parentPostId?: string,
	) {
		const posts = await this.postRepository.cursor(
			parentPostId ?? null,
			query,
		);
		const ids = posts.map((p) => p.id);

		const likedIds = userId
			? await this.likeRepository.findLikedPostIds(userId, ids)
			: [];
		const likedSet = new Set(likedIds);

		const enriched = posts.map((p) => ({
			...p,
			likeCount: p._count.likes,
			commentCount: p._count.replies,
			isLiked: likedSet.has(p.id),
		}));

		return this.cursor.create(enriched, query.limit, (post) => post.id);
	}

	async findUserComments(
		authorId: string,
		query: PostQueryDto,
		userId?: string,
	) {
		const posts = await this.postRepository.findUserComments(
			authorId,
			query,
		);
		const ids = posts.map((p) => p.id);

		const likedIds = userId
			? await this.likeRepository.findLikedPostIds(userId, ids)
			: [];
		const likedSet = new Set(likedIds);

		const enriched = posts.map((p) => ({
			...p,
			likeCount: p._count.likes,
			commentCount: p._count.replies,
			isLiked: likedSet.has(p.id),
		}));

		return this.cursor.create(enriched, query.limit, (post) => post.id);
	}

	async findUserReposts(
		authorId: string,
		query: PostQueryDto,
		userId?: string,
	) {
		const posts = await this.postRepository.findUserReposts(
			authorId,
			query,
		);
		const ids = posts.map((p) => p.id);

		const likedIds = userId
			? await this.likeRepository.findLikedPostIds(userId, ids)
			: [];
		const likedSet = new Set(likedIds);

		const enriched = posts.map((p) => ({
			...p,
			likeCount: p._count.likes,
			commentCount: p._count.replies,
			isLiked: likedSet.has(p.id),
		}));

		return this.cursor.create(enriched, query.limit, (post) => post.id);
	}

	findAll() {
		return this.postRepository.findAll();
	}

	async findOne(postId: string, userId?: string) {
		const res = await this.postRepository.findByIdWithDetails(postId);
		if (!res) throw new PostDoesNotExistException();

		const likedIds = userId
			? await this.likeRepository.findLikedPostIds(userId, [postId])
			: [];

		return {
			...res,
			likeCount: res._count.likes,
			commentCount: res._count.replies,
			isLiked: likedIds.includes(postId),
		};
	}

	create(
		userId: string,
		dto: CreatePostDto,
		imageUrl?: string,
		parentPostId?: string,
		quotedPostId?: string,
	) {
		return this.postRepository.create(
			userId,
			dto,
			imageUrl,
			parentPostId,
			quotedPostId,
		);
	}

	async delete(postId: string, userId: string) {
		const found = await this.postRepository.findById(postId);
		if (!found) throw new PostDoesNotExistException();
		if (found.authorId !== userId) throw new PostOwnershipException();
		if (found.imageUrl) {
			await this.storageService.delete(found.imageUrl);
		}
		return this.postRepository.delete(postId);
	}
}
