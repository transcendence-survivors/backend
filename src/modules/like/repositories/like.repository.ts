import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikeRepository {
	constructor(private readonly prisma: PrismaService) {}

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
}
