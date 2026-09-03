import { Injectable } from '@nestjs/common';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_EVENTS } from '@/contracts/events/internal';
import { ChatMessageCreatedEvent } from '@/contracts/events/internal/chat/chat-message-created.event';
import { ChatMessageSoftDeleteEvent } from '@/contracts/events/internal/chat/chat-message-soft-delete.event';
import { ChatMessageEditedEvent } from '@/contracts/events/internal/chat/chat-message-edited.event';

@Injectable()
export class ChatEventListener {
	constructor(private broadcaster: ChatBroadcaster) {}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_CREATED)
	handleMessageCreated(event: ChatMessageCreatedEvent) {
		this.broadcaster.messageNew(event.message);
	}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_EDITED)
	handleMessageEdited(event: ChatMessageEditedEvent) {
		this.broadcaster.messageEdited(event.message);
	}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_SOFT_DELETED)
	handleMessageSoftDeleted(event: ChatMessageSoftDeleteEvent) {
		this.broadcaster.messageSoftDeleted(event.messageId, event.roomId);
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_REMOVED)
	handleMemberRemoved(payload: { roomId: string; userId: string }) {
		this.broadcaster.memberRemoved(payload.roomId, payload.userId);
	}
}
