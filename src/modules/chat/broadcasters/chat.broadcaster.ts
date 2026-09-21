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

@Injectable()
export class ChatBroadcaster {
	constructor(
		private readonly ws: WsServerProvider,
		@InjectPresenceStore() private readonly presenceStore: IPresenceStore,
		private readonly messageMapper: ChatMessageMapper,
		private readonly memberMapper: ChatMemberMapper,
		private readonly roomMapper: ChatRoomMapper,
	) {}

	messageNew(message: ChatMessageListItem) {
		const dto = this.messageMapper.toListItemDto(message);

		this.ws
			.get()
			.to(message.roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_NEW, dto);
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

	private forceLeaveRoom(userId: string, roomId: string) {
		const socketIds = this.presenceStore.getSocketsByUserId(userId);
		for (const socketId of socketIds) {
			void this.ws.get().sockets.sockets.get(socketId)?.leave(roomId);
		}
	}
}
