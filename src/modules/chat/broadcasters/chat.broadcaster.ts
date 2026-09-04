import { WsServerProvider } from '@/core/websocket/provider/ws-server.provider';
import { CHAT_EVENTS } from '../chat.events';
import { ChatMember } from '@prisma-generated/browser';
import { InjectPresenceStore } from '@/contracts/services/presence/presence-store.inject';
import { type IPresenceStore } from '@/contracts/services/presence/presence-store.port';
import { Injectable } from '@nestjs/common';
import { ChatMessageListItem } from '../message/types/records/chat-message-list-item';
import { Socket } from 'socket.io';
import { ChatTypingUpdatePayload } from '../types/records/chat-typing-update.type';

@Injectable()
export class ChatBroadcaster {
	constructor(
		private readonly ws: WsServerProvider,
		@InjectPresenceStore() private readonly presenceStore: IPresenceStore,
	) {}

	messageNew(message: ChatMessageListItem) {
		this.ws
			.get()
			.to(message.roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_NEW, message);
	}

	messageEdited(message: ChatMessageListItem) {
		this.ws
			.get()
			.to(message.roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_EDITED, message);
	}

	messageSoftDeleted(messageId: string, roomId: string) {
		this.ws
			.get()
			.to(roomId)
			.emit(CHAT_EVENTS.SEND.MESSAGE_SOFT_DELETED, { messageId, roomId });
	}

	typingUpdate(client: Socket, payload: ChatTypingUpdatePayload) {
		client.to(payload.roomId).emit(CHAT_EVENTS.SEND.TYPING_UPDATE, payload);
	}

	memberAdded(roomId: string, member: ChatMember) {
		this.ws.get().to(roomId).emit(CHAT_EVENTS.SEND.MEMBER_ADDED, member);
	}

	memberRemoved(roomId: string, userId: string) {
		this.ws
			.get()
			.to(roomId)
			.emit(CHAT_EVENTS.SEND.MEMBER_REMOVED, { roomId, userId });
		this.forceLeaveRoom(userId, roomId);
	}

	private forceLeaveRoom(userId: string, roomId: string) {
		const socketIds = this.presenceStore.getSocketsByUserId(userId);
		for (const socketId of socketIds) {
			void this.ws.get().sockets.sockets.get(socketId)?.leave(roomId);
		}
	}
}
