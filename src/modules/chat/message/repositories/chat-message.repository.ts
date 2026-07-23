import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatMessagesCursorParams } from '../types/params/chat-messages-cursor.params';
import { ChatMessageQueryHelper } from './chat-message-query.helper';
import { ChatMessageCreateParams } from '../types/params/chat-message-create-params';
import { ChatMessageListItem } from '../types/records/chat-message-list-item';
import { ChatMessageSelect } from '@prisma-generated/models';

interface ChatMemberFindParams {
	roomId: string;
	userId: string;
}

interface ChatMessageCountParams {
	roomId: string;
	userId: string;
	search?: string;
}

@Injectable()
export class ChatMessageRepository {
	constructor(private readonly prisma: PrismaService) {}

	cursor({
		limit,
		cursor,
		search,
		orderBy,
		userId,
		roomId,
	}: ChatMessagesCursorParams): Promise<ChatMessageListItem[]> {
		return this.prisma.chatMessage.findMany({
			...ChatMessageQueryHelper.pagination(limit, cursor),
			where: {
				AND: [
					ChatMessageQueryHelper.whereRoom(userId, roomId),
					ChatMessageQueryHelper.whereSearch(search),
				],
			},
			select: {
				...ChatMessageQueryHelper.chatMessageSelect,
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
			orderBy: ChatMessageQueryHelper.orderBy[orderBy],
		});
	}

	count({ search, userId, roomId }: ChatMessageCountParams): Promise<number> {
		return this.prisma.chatMessage.count({
			where: {
				AND: [
					ChatMessageQueryHelper.whereRoom(userId, roomId),
					ChatMessageQueryHelper.whereSearch(search),
				],
			},
		});
	}

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
