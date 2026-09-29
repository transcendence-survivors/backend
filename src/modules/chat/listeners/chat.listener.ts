import { Injectable } from '@nestjs/common';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';
import { OnEvent } from '@nestjs/event-emitter';
import {
	APP_EVENTS,
	BlockCreatedEvent,
	ChatMemberJoinedEvent,
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
import { ChatMemberRole, ChatMessageType } from '@prisma-generated/enums';
import { ChatMemberService } from '../member/services/chat-member.service';
import { ChatRoomService } from '../room/services/chat-room.service';
@Injectable()
export class ChatEventListener {
	constructor(
		private readonly broadcaster: ChatBroadcaster,
		private readonly messageService: ChatMessageService,
		private readonly memberService: ChatMemberService,
		private readonly roomService: ChatRoomService,
	) {}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_CREATED)
	async handleMessageCreated(event: ChatMessageCreatedEvent) {
		const memberIds = await this.getRoomMemberIds(event.message.roomId);
		await this.broadcaster.messageNew(event.message, memberIds);
	}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_EDITED)
	async handleMessageEdited(event: ChatMessageEditedEvent) {
		const memberIds = await this.getRoomMemberIds(event.message.roomId);
		await this.broadcaster.messageEdited(event.message, memberIds);
	}

	@OnEvent(APP_EVENTS.CHAT_MESSAGE_SOFT_DELETED)
	async handleMessageSoftDeleted(event: ChatMessageSoftDeleteEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);
		await this.broadcaster.messageSoftDeleted(
			event.messageId,
			event.roomId,
			memberIds,
		);
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_ROLE_UPDATED)
	async handleMemberRoleUpdated(event: ChatMemberRoleUpdatedEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);

		await Promise.all([
			this.broadcaster.memberRoleUpdated(
				event.roomId,
				event.targetUserId,
				event.newRole,
				memberIds,
			),
			this.messageService.createSystemMessage({
				type: ChatMessageType.ROLE_UPDATED,
				roomId: event.roomId,
				senderId: event.actorId,
				targetUserId: event.targetUserId,
				oldRole: event.oldRole,
				newRole: event.newRole,
			}),
		]);
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_KICKED)
	async handleMemberKicked(event: ChatMemberKickedEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);

		await Promise.all([
			this.broadcaster.memberRemoved(
				event.roomId,
				event.targetUserId,
				memberIds,
				true,
			),
			this.messageService.createSystemMessage({
				type: ChatMessageType.KICKED,
				roomId: event.roomId,
				senderId: event.senderId,
				targetUserId: event.targetUserId,
			}),
		]);
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_JOINED)
	async handleMemberJoined(event: ChatMemberJoinedEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);

		await Promise.all([
			this.broadcaster.memberAdded(event.roomId, event.userId, memberIds),
			this.messageService.createSystemMessage({
				type: ChatMessageType.JOINED,
				senderId: event.senderId,
				roomId: event.roomId,
				targetUserId: event.userId,
			}),
		]);
	}

	@OnEvent(APP_EVENTS.CHAT_MEMBER_LEFT)
	async handleMemberLeft(event: ChatMemberLeftEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);

		await Promise.all([
			this.broadcaster.memberRemoved(
				event.roomId,
				event.userId,
				memberIds,
				false,
			),
			this.messageService.createSystemMessage({
				type: ChatMessageType.LEFT,
				roomId: event.roomId,
				targetUserId: event.userId,
			}),
		]);
	}

	@OnEvent(APP_EVENTS.CHAT_OWNERSHIP_TRANSFERRED)
	async handleOwnershipTransferred(event: ChatOwnershipTransferredEvent) {
		const memberIds = await this.getRoomMemberIds(event.roomId);

		await Promise.all([
			this.broadcaster.memberRoleUpdated(
				event.roomId,
				event.targetUserId,
				ChatMemberRole.OWNER,
				memberIds,
			),
			this.broadcaster.memberRoleUpdated(
				event.roomId,
				event.senderId,
				ChatMemberRole.ADMIN,
				memberIds,
			),
			this.messageService.createSystemMessage({
				type: ChatMessageType.OWNERSHIP_TRANSFERRED,
				roomId: event.roomId,
				senderId: event.senderId,
				targetUserId: event.targetUserId,
				oldRole: event.oldRole,
				newRole: event.newRole,
			}),
		]);
	}

	@OnEvent(APP_EVENTS.CHAT_ROOM_CREATED)
	async handleRoomCreated(event: ChatRoomCreatedEvent) {
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROOM_CREATED,
			roomId: event.roomId,
			senderId: event.senderId,
		});
	}

	@OnEvent(APP_EVENTS.CHAT_ROOM_RENAMED)
	async handleRoomRenamed(event: ChatRoomRenamedEvent) {
		this.broadcaster.roomRenamed(event.roomId, event.newValue);
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
		this.broadcaster.roomAvatarChanged(event.roomId, event.newValue);
		await this.messageService.createSystemMessage({
			type: ChatMessageType.ROOM_AVATAR_CHANGED,
			roomId: event.roomId,
			senderId: event.senderId,
			oldValue: event.oldValue,
			newValue: event.newValue,
		});
	}

	@OnEvent(APP_EVENTS.BLOCK_CREATED)
	async handleBlockCreated(event: BlockCreatedEvent) {
		await this.roomService.deleteDmRoom(
			event.blockerUserId,
			event.blockedUserId,
		);
	}

	private getRoomMemberIds(roomId: string): Promise<string[]> {
		return this.memberService.findUserIdsByRoomId(roomId);
	}
}
