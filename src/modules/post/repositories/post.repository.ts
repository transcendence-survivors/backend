import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { PostCreateDto } from '../dtos/requests/post-create.dto';
import { DbContext } from '@/core/database/uow/db-context';
import { PostOrderByWithRelationInput } from '@prisma-generated/models';
import { PostPaginateDto } from '../dtos/requests/post-paginate.dto';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import type { PostSelect } from '@prisma-generated/models';
import { PostOrderByEnum } from '../types/enums/post-order-by.enum';

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
		_count: { select: { likes: true, replies: true, reposts: true } },
	} satisfies PostSelect;

	private readonly orderByCursorMapping: Record<
		PostOrderByEnum,
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
		dto: PostCreateDto,
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
		{ limit, cursor, orderBy, search }: PostPaginateDto,
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
		{ limit, cursor, orderBy, search }: PostPaginateDto,
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
		{ limit, cursor, orderBy, search }: PostPaginateDto,
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

	findUserPosts(
		authorId: string,
		{ limit, cursor, orderBy, search }: PostPaginateDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				authorId,
				parentPostId: null,
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
		{ limit, cursor, orderBy, search }: PostPaginateDto,
		excludeUserId?: string,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
				parentPostId,
				...(excludeUserId && { authorId: { not: excludeUserId } }),
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
