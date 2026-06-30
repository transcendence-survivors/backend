import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { DbContext } from '@/core/database/uow/db-context';
import { PostOrderByWithRelationInput } from '@prisma-generated/models';
import { PostQueryDto } from '../dto/post-querry.dto';
import { UserRepository } from '@/modules/user/repositories/user.repository';

export const POST_ORDER_BY = ['date-asc', 'date-desc'] as const;
export type PostOrderBy = (typeof POST_ORDER_BY)[number];

@Injectable()
export class PostRepository {
	static readonly postSelect = {
		id: true,
		content: true,
		createdAt: true,
		author: {
			select: UserRepository.userSelect,
		},
	};
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

	create(userId: string, dto: CreatePostDto) {
		return this.prisma.post.create({
			data: {
				authorId: userId,
				content: dto.content,
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
			},
		});
	}

	delete(postId: string) {
		return this.prisma.post.delete({
			where: {
				id: postId,
			},
		});
	}

	cursor({ limit, cursor, orderBy, search }: PostQueryDto, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.post.findMany({
			take: limit + 1,
			where: {
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
