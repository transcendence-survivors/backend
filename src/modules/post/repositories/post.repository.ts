import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { DbContext } from '@/core/database/uow/db-context';
import { PostOrderByWithRelationInput } from '@prisma-generated/models';
import { PostQueryDto } from '../dto/post-query.dto';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import type { PostSelect } from '@prisma-generated/models';

export const POST_ORDER_BY = ['date-asc', 'date-desc'] as const;
export type PostOrderBy = (typeof POST_ORDER_BY)[number];

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
		_count: { select: { likes: true, replies: true } },
	} satisfies PostSelect;
	private readonly orderByCursorMapping: Record<
		PostOrderBy,
		PostOrderByWithRelationInput[]
	> = {
		'date-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
		'date-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
	};

	constructor(private readonly prisma: PrismaService) {}
	findAll() {
		return this.prisma.post.findMany();
	}

	create(
		userId: string,
		dto: CreatePostDto,
		imageUrl?: string,
		parentPostId?: string,
		quotedPostId?: string,
	) {
		return this.prisma.post.create({
			data: {
				authorId: userId,
				content: dto.content,
				imageUrl,
				parentPostId,
				quotedPostId,
			},
		});
	}

	findById(postId: string) {
		return this.prisma.post.findFirst({
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

	findByIdWithDetails(postId: string) {
		return this.prisma.post.findFirst({
			where: {
				id: postId,
			},
			select: PostRepository.postSelect,
		});
	}

	findUserComments(
		authorId: string,
		{ limit, cursor, orderBy, search }: PostQueryDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				authorId,
				parentPostId: { not: null },
				...(search && {
					content: {
						contains: search,
					},
				}),
			},
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserReposts(
		authorId: string,
		{ limit, cursor, orderBy, search }: PostQueryDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				authorId,
				quotedPostId: { not: null },
				...(search && {
					content: {
						contains: search,
					},
				}),
			},
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	findUserLikes(
		userId: string,
		{ limit, cursor, orderBy, search }: PostQueryDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				likes: { some: { userId } },
				...(search && {
					content: {
						contains: search,
					},
				}),
			},
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}

	delete(postId: string) {
		return this.prisma.post.delete({
			where: {
				id: postId,
			},
		});
	}

	cursor(
		parentPostId: string | null,
		{ limit, cursor, orderBy, search }: PostQueryDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				parentPostId,
				...(search && {
					content: {
						contains: search,
					},
				}),
			},
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			orderBy: this.orderByCursorMapping[orderBy],
			select: PostRepository.postSelect,
		});
	}
}
