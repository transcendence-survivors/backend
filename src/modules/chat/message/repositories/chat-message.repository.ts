import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';

interface ChatMessageCreateParams {
	roomId: string;
	senderId: string;
	content: string;
	replyToId?: string;
	attachmentUrls?: string[];
}

interface ChatMemberFindParams {
	roomId: string;
	userId: string;
}

@Injectable()
export class ChatMessageRepository {
	constructor(private readonly prisma: PrismaService) {}

	create({
		roomId,
		senderId,
		content,
		replyToId,
		attachmentUrls,
	}: ChatMessageCreateParams) {
		return this.prisma.chatMessage.create({
			data: {
				roomId: roomId,
				senderId: senderId,
				content: content,
				replyToId: replyToId,
				attachmentUrls: attachmentUrls,
			},
		});
	}

	softDelete(id: string) {
		return this.prisma.chatMessage.updateMany({
			where: { id },
			data: { isDeleted: true },
		});
	}

	findById(id: string) {
		return this.prisma.chatMessage.findUnique({
			where: { id },
			select: {
				id: true,
				roomId: true,
				senderId: true,
			},
		});
	}

	findByRoomAndUser({ roomId, userId }: ChatMemberFindParams) {
		return this.prisma.chatMember.findUnique({
			where: { roomId_userId: { roomId, userId } },
			select: { role: true, isMuted: true },
		});
	}
}
