import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

export interface ChatNotificationMemberReadCutoff {
	roomId: string;
	cutoffDate: Date;
}

export interface ChatNotificationMessageStub {
	roomId: string;
	createdAt: Date;
}

@Injectable()
export class ChatNotificationRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findReadCutoffsForRooms(
		userId: string,
		roomIds?: string[],
	): Promise<ChatNotificationMemberReadCutoff[]> {
		const memberships = await this.prisma.chatMember.findMany({
			where: {
				userId,
				...(roomIds &&
					roomIds.length > 0 && { roomId: { in: roomIds } }),
			},
			select: {
				roomId: true,
				joinedAt: true,
				lastReadAt: true,
			},
		});

		return memberships.map((m) => ({
			roomId: m.roomId,
			cutoffDate: m.lastReadAt ?? m.joinedAt,
		}));
	}

	async findCandidateMessages(
		userId: string,
		roomIds: string[],
		minCutoffDate: Date,
	): Promise<ChatNotificationMessageStub[]> {
		if (roomIds.length === 0) return [];

		return this.prisma.chatMessage.findMany({
			where: {
				roomId: { in: roomIds },
				createdAt: { gt: minCutoffDate },
				senderId: { not: userId },
				isDeleted: false,
			},
			select: {
				roomId: true,
				createdAt: true,
			},
		});
	}

	async updateLastReadAt(
		userId: string,
		roomId: string,
		readAt: Date = new Date(),
	): Promise<Date> {
		const updatedMember = await this.prisma.chatMember.update({
			where: {
				roomId_userId: { roomId, userId },
			},
			data: {
				lastReadAt: readAt,
			},
			select: { lastReadAt: true },
		});

		return updatedMember.lastReadAt ?? readAt;
	}

	async updateLastReadAtForUsers(
		roomId: string,
		userIds: string[],
		readAt: Date = new Date(),
	): Promise<void> {
		if (userIds.length === 0) return;

		await this.prisma.chatMember.updateMany({
			where: {
				roomId,
				userId: { in: userIds },
			},
			data: {
				lastReadAt: readAt,
			},
		});
	}
}
