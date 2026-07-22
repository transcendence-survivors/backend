import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepostRepository {
	constructor(private readonly prisma: PrismaService) {}

	findRepostedPostIds(userId: string, postIds: string[]) {
		return this.prisma.repost
			.findMany({
				where: { userId, postId: { in: postIds } },
				select: { postId: true },
			})
			.then((rows) => rows.map((r) => r.postId));
	}

	addRepost(postId: string, userId: string) {
		return this.prisma.repost.create({
			data: {
				postId,
				userId,
			},
		});
	}

	deleteRepost(postId: string, userId: string) {
		return this.prisma.repost.delete({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});
	}

	countRepost(postId: string) {
		return this.prisma.repost.count({
			where: {
				postId,
			},
		});
	}

	isReposted(postId: string, userId: string) {
		return this.prisma.repost.findUnique({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});
	}
}
