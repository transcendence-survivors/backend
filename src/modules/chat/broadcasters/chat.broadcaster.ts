import { WsServerProvider } from '@/core/websocket/provider/ws-server.provider';
import { CHAT_EVENTS } from '../chat.events';
import { ChatMemberRole } from '@prisma-generated/browser';
import { InjectPresenceStore } from '@/contracts/services/presence/presence-store.inject';
import { type IPresenceStore } from '@/contracts/services/presence/presence-store.port';
import { Injectable } from '@nestjs/common';
import { ChatMessageListItem } from '../message/types/records/chat-message-list-item';
import { Socket } from 'socket.io';
import { ChatTypingUpdatePayload } from '../types/records/chat-typing-update.type';
import { ChatMessageMapper } from '../message/mappers/chat-message.mapper';
import { ChatMemberMapper } from '../member/mappers/chat-member.mapper';
import { ChatRoomMapper } from '../room/mappers/chat-room.mapper';
import { ChatNotificationMapper } from '../notification/mappers/chat-notification.mapper';
import { ChatNotificationService } from '../notification/services/chat-notification.service';
import { UserSocket } from '@/core/websocket/interface/ws-socket.inteface';

@Injectable()
export class ChatBroadcaster {
	constructor(
		private readonly ws: WsServerProvider,
		@InjectPresenceStore() private readonly presenceStore: IPresenceStore,
		private readonly messageMapper: ChatMessageMapper,
		private readonly memberMapper: ChatMemberMapper,
		private readonly roomMapper: ChatRoomMapper,
		private readonly notificationMapper: ChatNotificationMapper,
		private readonly notificationService: ChatNotificationService,
	) {}

	async messageNew(message: ChatMessageListItem, memberUserIds: string[]) {
		const messageDto = this.messageMapper.toListItemDto(message);
		const notificationDto = this.notificationMapper.toNotificationNewDto(
			message.roomId,
		);

		this.ws
			.get()
			.to(message.roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_NEW, messageDto);

		const activeSockets = (await this.ws
			.get()
			.in(message.roomId)
			.fetchSockets()) as unknown as UserSocket[];

		const activeUserIdsInRoom = new Set<string>();
		for (const socket of activeSockets) {
			const userId = socket.data.user?.sub;
			if (userId) activeUserIdsInRoom.add(userId);
		}

		if (message?.sender?.id) activeUserIdsInRoom.add(message.sender.id);

		for (const userId of memberUserIds) {
			if (activeUserIdsInRoom.has(userId)) continue;

			const socketIds = this.presenceStore.getSocketsByUserId(userId);
			for (const socketId of socketIds) {
				this.ws
					.get()
					.to(socketId)
					.emit(
						CHAT_EVENTS.SEND.NOTIFICATION_MESSAGE_NEW,
						notificationDto,
					);
			}
		}

		if (activeUserIdsInRoom.size <= 0) return;
		void this.notificationService.markRoomAsReadForUsers(
			message.roomId,
			Array.from(activeUserIdsInRoom),
			message.createdAt,
		);
	}

	messageEdited(message: ChatMessageListItem) {
		const dto = this.messageMapper.toListItemDto(message);

		this.ws
			.get()
			.to(message.roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_EDITED, dto);
	}

	messageSoftDeleted(messageId: string, roomId: string) {
		const dto = this.messageMapper.toSoftDeletedDto(messageId, roomId);

		this.ws
			.get()
			.to(roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_SOFT_DELETED, dto);
	}

	typingUpdate(client: Socket, payload: ChatTypingUpdatePayload) {
		const dto = this.messageMapper.toTypingUpdateDto(payload);

		client.to(payload.roomId).emit(CHAT_EVENTS.SEND.TYPING_UPDATE, dto);
	}

	memberAdded(roomId: string, userId: string) {
		const dto = this.memberMapper.toAddedDto(roomId, userId);

		this.ws.get().to(roomId).emit(CHAT_EVENTS.SEND.MEMBER_ADDED, dto);
	}

	memberRoleUpdated(
		roomId: string,
		targetUserId: string,
		newRole: ChatMemberRole,
	) {
		const dto = this.memberMapper.toRoleUpdatedDto(
			roomId,
			targetUserId,
			newRole,
		);

		this.ws
			.get()
			.to(roomId)
			.emit(CHAT_EVENTS.SEND.MEMBER_ROLE_UPDATED, dto);
	}

	memberRemoved(roomId: string, userId: string) {
		const dto = this.memberMapper.toRemovedDto(roomId, userId);

		this.ws.get().to(roomId).emit(CHAT_EVENTS.SEND.MEMBER_REMOVED, dto);
		this.forceLeaveRoom(userId, roomId);
	}

	roomRenamed(roomId: string, newName: string) {
		const dto = this.roomMapper.toRoomRenamedResponseDto(roomId, newName);

		this.ws.get().to(roomId).emit(CHAT_EVENTS.SEND.ROOM_RENAMED, dto);
	}

	roomAvatarChanged(roomId: string, newAvatarUrl: string | null) {
		const dto = this.roomMapper.toRoomAvatarChangedResponseDto(
			roomId,
			newAvatarUrl,
		);

		this.ws
			.get()
			.to(roomId)
			.emit(CHAT_EVENTS.SEND.ROOM_AVATAR_CHANGED, dto);
	}

	successReadNotification(userId: string, roomId: string, readAt: Date) {
		const dto = this.notificationMapper.toRoomReadSuccessDto(
			roomId,
			readAt,
		);
		const socketIds = this.presenceStore.getSocketsByUserId(userId);

		for (const socketId of socketIds) {
			this.ws
				.get()
				.to(socketId)
				.emit(CHAT_EVENTS.SEND.NOTIFICATION_READ, dto);
		}
	}

	private forceLeaveRoom(userId: string, roomId: string) {
		const socketIds = this.presenceStore.getSocketsByUserId(userId);
		for (const socketId of socketIds) {
			void this.ws.get().sockets.sockets.get(socketId)?.leave(roomId);
		}
	}
}
