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
import { DbContext } from '@/core/database/uow/db-context';
import { ChatMessageEditParams } from '../types/params/chat-message-edit.params';

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
				...ChatMessageQueryHelper.chatMessageSelect(roomId),
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

	create(
		{
			roomId,
			senderId,
			content,
			replyToId,
			attachmentUrls,
		}: ChatMessageCreateParams,
		ctx?: DbContext,
	): Promise<ChatMessageListItem> {
		const client = ctx?.client ?? this.prisma;
		return client.chatMessage.create({
			data: {
				roomId: roomId,
				senderId: senderId,
				content: content,
				attachmentUrls: attachmentUrls,
				replyToId: replyToId,
			},
			select: {
				...ChatMessageQueryHelper.chatMessageSelect(roomId),
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
		});
	}

	async createSystemMessage(
		params: ChatMessageCreateSystemParams,
		ctx?: DbContext,
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
			case ChatMessageType.JOINED:
			case ChatMessageType.LEFT:
				metadataData = {
					targetUserId: params.targetUserId,
				};
				break;
			default:
				metadataData = null;
				break;
		}

		const client = ctx?.client ?? this.prisma;
		return client.chatMessage.create({
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
				...ChatMessageQueryHelper.chatMessageSelect(params.roomId),
			} satisfies Record<
				keyof ChatMessageListItem,
				ChatMessageSelect[keyof ChatMessageListItem]
			>,
		});
	}

	updateLastActivity(roomId: string, ctx?: DbContext): Promise<unknown> {
		const client = ctx?.client ?? this.prisma;
		return client.chatRoom.update({
			where: { id: roomId },
			data: { lastActivityAt: new Date() },
			select: {
				id: true,
			},
		});
	}

	softDelete(id: string) {
		return this.prisma.chatMessage.updateMany({
			where: { id },
			data: { isDeleted: true },
		});
	}

	edit({
		roomId,
		messageId,
		userId,
		content,
	}: ChatMessageEditParams): Promise<ChatMessageListItem> {
		return this.prisma.chatMessage.update({
			where: { id: messageId, roomId, senderId: userId },
			data: { content, isEdited: true },
			select: {
				...ChatMessageQueryHelper.chatMessageSelect(roomId),
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
