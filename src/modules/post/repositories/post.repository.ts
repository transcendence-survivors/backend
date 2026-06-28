import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { DbContext } from '@/core/database/uow/db-context';
import { PostOrderByWithRelationInput } from '@prisma-generated/models';

export const POST_ORDER_BY = ['date-asc', 'date-desc'] as const;

export type OrderBy = (typeof POST_ORDER_BY)[number];

@Injectable()
export class PostRepository {
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

	static readonly postSelect = {
		id: true,
		content: true,
		authorId: true,
		createdAt: true,
		updatedAt: true,
		author: {
			select: {
				id: true,
				username: true,
				displayName: true,
				avatarUrl: true,
			},
		},
	};

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

	private readonly orderByMapping: Record<
		OrderBy,
		PostOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
	};

	paginate(page: number, limit: number, orderBy?: OrderBy, ctx?: DbContext) {
		const skip = (page - 1) * limit;
		const client = ctx?.client ?? this.prisma;
		return Promise.all([
			client.post.findMany({
				skip,
				take: limit,
				orderBy: orderBy ? this.orderByMapping[orderBy] : undefined,
				select: PostRepository.postSelect,
			}),
			client.post.count(),
		]);
	}
}
