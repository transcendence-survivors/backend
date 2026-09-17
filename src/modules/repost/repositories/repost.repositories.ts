import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepostRepository {
	constructor(private readonly prisma: PrismaService) {}

	findRepostedPostIds(userId: string, postIds: string[]) {
		return this.prisma.post
			.findMany({
				where: {
					authorId: userId,
					type: 'REPOST',
					quotedPostId: { in: postIds },
				},
				select: { quotedPostId: true },
			})
			.then((rows) => rows.map((r) => r.quotedPostId as string));
	}

	addRepost(postId: string, userId: string) {
		return this.prisma.post.create({
			data: {
				authorId: userId,
				quotedPostId: postId,
				type: 'REPOST',
			},
		});
	}

	deleteRepost(postId: string, userId: string) {
		return this.prisma.post.deleteMany({
			where: {
				authorId: userId,
				quotedPostId: postId,
				type: 'REPOST',
			},
		});
	}

	countRepost(postId: string) {
		return this.prisma.post.count({
			where: {
				quotedPostId: postId,
				type: 'REPOST',
			},
		});
	}

	isReposted(postId: string, userId: string) {
		return this.prisma.post.findFirst({
			where: {
				authorId: userId,
				quotedPostId: postId,
				type: 'REPOST',
			},
		});
	}
}
