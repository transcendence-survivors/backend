import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { DbContext } from '@/core/database/uow/db-context';
import { PostOrderByWithRelationInput } from '@prisma-generated/models';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import type { PostSelect } from '@prisma-generated/models';
import { PostOrderByEnum } from '../types/enums/post-order-by.enum';
import type { PostCreateParams } from '../types/params/post-create.params';
import { PostType } from '@prisma-generated/client';
import type {
	PostsByAuthorCursorParams,
	PostsFeedCursorParams,
	PostsLikedByCursorParams,
} from '../types/params/posts-cursor.params';

@Injectable()
export class PostRepository {
	static readonly postSelect = {
		id: true,
		content: true,
		createdAt: true,
		imageUrl: true,
		parentPostId: true,
		author: {
			select: UserQueryHelper.userSelect,
		},
		parent: {
			select: {
				content: true,
				author: {
					select: UserQueryHelper.userSelect,
				},
			},
		},
		quotedPostId: true,
		quotedPost: {
			select: {
				content: true,
				author: {
					select: UserQueryHelper.userSelect,
				},
			},
		},
		_count: {
			select: {
				likes: true,
				replies: true,
				quotes: { where: { type: 'REPOST' } },
			},
		},
	} satisfies PostSelect;

	private readonly orderByCursorMapping: Record<
		PostOrderByEnum,
		PostOrderByWithRelationInput[]
	> = {
		'date-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
		'date-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
	};

	constructor(private readonly prisma: PrismaService) {}

	private pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	private searchWhere(search?: string) {
		return search ? { content: { contains: search } } : {};
	}

	create(
		{
			authorId,
			content,
			imageUrl,
			parentPostId,
			quotedPostId,
		}: PostCreateParams,
		ctx?: DbContext,
	) {
		const type: PostType = parentPostId
			? 'REPLY'
			: quotedPostId
				? 'QUOTE'
				: 'POST';

		return (ctx?.client ?? this.prisma).post.create({
			data: {
				authorId,
				content,
				imageUrl,
				parentPostId,
				quotedPostId,
				type,
			},
		});
	}

	findById(postId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).post.findFirst({
			where: {
				id: postId,
			},
			select: {
				authorId: true,
				id: true,
				imageUrl: true,
			},
		});
	}

	findByIdWithDetails(postId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).post.findFirst({
			where: {
				id: postId,
			},
			select: PostRepository.postSelect,
		});
	}

	cursor(
		{
			parentPostId,
			excludeUserId,
			limit,
			cursor,
			orderBy,
			search,
		}: PostsFeedCursorParams,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			...this.pagination(limit, cursor),
			where: {
				parentPostId,
				...(excludeUserId && { authorId: { not: excludeUserId } }),
				...this.searchWhere(search),
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserPosts(
		{ authorId, limit, cursor, orderBy, search }: PostsByAuthorCursorParams,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			...this.pagination(limit, cursor),
			where: {
				authorId,
				parentPostId: null,
				...this.searchWhere(search),
				type: { not: 'REPOST' },
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserComments(
		{ authorId, limit, cursor, orderBy, search }: PostsByAuthorCursorParams,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			...this.pagination(limit, cursor),
			where: {
				authorId,
				parentPostId: { not: null },
				...this.searchWhere(search),
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserReposts(
		{ authorId, limit, cursor, orderBy, search }: PostsByAuthorCursorParams,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			...this.pagination(limit, cursor),
			where: {
				authorId,
				type: 'REPOST',
				...this.searchWhere(search),
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserLikes(
		{ userId, limit, cursor, orderBy, search }: PostsLikedByCursorParams,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			...this.pagination(limit, cursor),
			where: {
				likes: { some: { userId } },
				...this.searchWhere(search),
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	delete(postId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).post.delete({
			where: {
				id: postId,
			},
		});
	}
}
