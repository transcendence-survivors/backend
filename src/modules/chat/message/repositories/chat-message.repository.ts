import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatMessagesCursorParams } from '../types/params/chat-messages-cursor.params';
import { ChatMessageQueryHelper } from './chat-message-query.helper';
import { ChatMessageCreateParams } from '../types/params/chat-message-create.params';
import { ChatMessageListItem } from '../types/records/chat-message-list-item';
import { ChatMessageSelect } from '@prisma-generated/models';
import { ChatMessageCountParams } from '../types/params/chat-message-count.params';
import { ChatMessageCreateSystemParams } from '../types/params/chat-message-create-system.params';
import { ChatMemberRole, ChatMessageType } from '@prisma-generated/enums';

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
	}: ChatMessageCreateParams): Promise<ChatMessageListItem> {
		return this.prisma.chatMessage.create({
			data: {
				roomId: roomId,
				senderId: senderId,
				content: content,
				attachmentUrls: attachmentUrls,
				replyToId: replyToId,
			},
			select: {
				...ChatMessageQueryHelper.chatMessageSelect,
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
		});
	}

	async createSystemMessage(
		params: ChatMessageCreateSystemParams,
	): Promise<ChatMessageListItem> {
		const senderId = 'senderId' in params ? params.senderId : null;

		let metadataData: {
			targetUserId?: string;
			oldRole?: ChatMemberRole;
			newRole?: ChatMemberRole;
			oldValue?: string;
			newValue?: string;
		} | null = null;

		switch (params.type) {
			case ChatMessageType.ROLE_UPDATED:
				metadataData = {
					targetUserId: params.targetUserId,
					oldRole: params.oldRole,
					newRole: params.newRole,
				};
				break;

			case ChatMessageType.KICKED:
				metadataData = {
					targetUserId: params.targetUserId,
				};
				break;

			case ChatMessageType.ROOM_RENAMED:
			case ChatMessageType.ROOM_AVATAR_CHANGED:
				if (params.oldValue || params.newValue) {
					metadataData = {
						oldValue: params.oldValue ?? undefined,
						newValue: params.newValue ?? undefined,
					};
				}
				break;
			case ChatMessageType.OWNERSHIP_TRANSFERRED:
				metadataData = {
					targetUserId: params.targetUserId,
					oldRole: params.oldRole,
					newRole: params.newRole,
				};
				break;

			default:
				metadataData = null;
				break;
		}

		return this.prisma.chatMessage.create({
			data: {
				roomId: params.roomId,
				senderId: senderId ?? null,
				type: params.type,
				content: null,
				...(metadataData && {
					metadata: {
						create: metadataData,
					},
				}),
			},
			select: {
				...ChatMessageQueryHelper.chatMessageSelect,
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
		});
	}

	softDelete(id: string) {
		return this.prisma.chatMessage.updateMany({
			where: { id },
			data: { isDeleted: true },
		});
	}

	edit(id: string, content?: string): Promise<ChatMessageListItem> {
		return this.prisma.chatMessage.update({
			where: { id },
			data: { content, isEdited: true },
			select: {
				...ChatMessageQueryHelper.chatMessageSelect,
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
		});
	}

	findById(id: string) {
		return this.prisma.chatMessage.findUnique({
			where: { id },
			select: {
				id: true,
				roomId: true,
				senderId: true,
				attachmentUrls: true,
			},
		});
	}
}
