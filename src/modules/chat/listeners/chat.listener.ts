import { Injectable } from '@nestjs/common';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';
import { OnEvent } from '@nestjs/event-emitter';
import {
	APP_EVENTS,
	ChatMemberKickedEvent,
	ChatMemberLeftEvent,
	ChatMemberRoleUpdatedEvent,
	ChatMessageEditedEvent,
	ChatMessageSoftDeleteEvent,
	ChatOwnershipTransferredEvent,
	ChatRoomAvatarChangedEvent,
	ChatRoomCreatedEvent,
	ChatRoomRenamedEvent,
} from '@/contracts/events/internal';
import { ChatMessageCreatedEvent } from '@/contracts/events/internal';
import { ChatMessageService } from '../message/services/chat-message.service';
import { ChatMessageType } from '@prisma-generated/enums';
@Injectable()
export class ChatEventListener {
	constructor(
		private readonly broadcaster: ChatBroadcaster,
		private readonly messageService: ChatMessageService,
	) {}

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

	@OnEvent(APP_EVENTS.CHAT_MEMBER_ROLE_UPDATED)
	async handleMemberRoleUpdated(event: ChatMemberRoleUpdatedEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROLE_UPDATED,
			roomId: event.roomId,
			senderId: event.actorId,
			targetUserId: event.targetUserId,
			oldRole: event.oldRole,
			newRole: event.newRole,
		});
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_KICKED)
	async handleMemberKicked(event: ChatMemberKickedEvent) {
		this.broadcaster.memberRemoved(event.roomId, event.targetUserId);
		await this.messageService.createSystemMessage({
			type: ChatMessageType.KICKED,
			roomId: event.roomId,
			senderId: event.senderId,
			targetUserId: event.targetUserId,
		});
	}

	// !TODO: Add broadcasting for member joined and left events

	// @OnEvent(APP_EVENTS.CHAT_MEMBER_JOINED)
	// async handleMemberJoined(event: ChatMemberJoinedEvent) {
	// 	await this.messageService.createSystemMessage({
	// 		type: ChatMessageType.JOINED,
	// 		senderId: event.userId,
	// 		roomId: event.roomId,
	// 		targetUserId: event.userId,
	// 	});
	// }

	@OnEvent(APP_EVENTS.CHAT_MEMBER_LEFT)
	async handleMemberLeft(event: ChatMemberLeftEvent) {
		this.broadcaster.memberRemoved(event.roomId, event.userId);

		await this.messageService.createSystemMessage({
			type: ChatMessageType.LEFT,
			roomId: event.roomId,
			targetUserId: event.userId,
		});
	}

	@OnEvent(APP_EVENTS.CHAT_OWNERSHIP_TRANSFERRED)
	async handleOwnershipTransferred(event: ChatOwnershipTransferredEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.OWNERSHIP_TRANSFERRED,
			roomId: event.roomId,
			senderId: event.senderId,
			targetUserId: event.targetUserId,
			oldRole: event.oldRole,
			newRole: event.newRole,
		});
	}

	@OnEvent(APP_EVENTS.CHAT_ROOM_CREATED)
	async handleRoomCreated(event: ChatRoomCreatedEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROOM_CREATED,
			roomId: event.roomId,
			senderId: event.senderId,
		});
	}

	// !TODO: Add broadcasting for room renamed and avatar changed events
	@OnEvent(APP_EVENTS.CHAT_ROOM_RENAMED)
	async handleRoomRenamed(event: ChatRoomRenamedEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROOM_RENAMED,
			roomId: event.roomId,
			senderId: event.senderId,
			oldValue: event.oldValue,
			newValue: event.newValue,
		});
	}
	@OnEvent(APP_EVENTS.CHAT_ROOM_AVATAR_CHANGED)
	async handleRoomAvatarChanged(event: ChatRoomAvatarChangedEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROOM_AVATAR_CHANGED,
			roomId: event.roomId,
			senderId: event.senderId,
			oldValue: event.oldValue,
			newValue: event.newValue,
		});
	}
}
