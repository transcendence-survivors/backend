import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikeRepository {
	constructor(private readonly prisma: PrismaService) {}

	findLikedPostIds(userId: string, postIds: string[]) {
		return this.prisma.like
			.findMany({
				where: { userId, postId: { in: postIds } },
				select: { postId: true },
			})
			.then((rows) => rows.map((r) => r.postId));
	}

	addLike(postId: string, userId: string) {
		return this.prisma.like.create({
			data: {
				postId,
				userId,
			},
		});
	}

	deleteLike(postId: string, userId: string) {
		return this.prisma.like.delete({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});
	}

	countLike(postId: string) {
		return this.prisma.like.count({
			where: {
				postId,
			},
		});
	}

	isLiked(postId: string, userId: string) {
		return this.prisma.like.findUnique({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});
	}
}
