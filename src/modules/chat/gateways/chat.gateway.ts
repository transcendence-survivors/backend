import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChatMessageService } from '../message/services/chat-message.service';
import { CHAT_EVENTS } from '../chat.events';
import { Server } from 'socket.io';
import { ChatMessageCreateDto } from '../message/dtos/requests/chat-message-create.dto';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type UserSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { WsExceptionsFilter } from '@/shared/filters/ws-exception.filter';
import { handleWs } from '@/shared/utils/exceptions.utils';
import { ChatMessageSoftDeleteDto } from '../message/dtos/requests/chat-message-softdelete';
import { ChatMessageEditDto } from '../message/dtos/requests/chat-message-edit.dto';
import { ChatMemberService } from '../member/services/chat-member.service';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';
import { ChatTypingDto } from '../message/dtos/requests/chat-typing.dto';
import { CustomValidationPipe } from '@/shared/pipes/custom-validation.pipe';
import { ChatRoomLeaveDto } from '../room/dtos/requests/chat-room-leave.dto';
import { ChatRoomJoinDto } from '../room/dtos/requests/chat-room-join.dto';
import { ChatNotificationMarkAsReadDto } from '../notification/dto/requests/chat-notification-mark-as-read.dto';
import { ChatNotificationService } from '../notification/services/chat-notification.service';
import { WsResponse } from '@/shared/types/response.type';

@UsePipes(CustomValidationPipe)
@UseFilters(WsExceptionsFilter)
@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly messagesService: ChatMessageService,
		private readonly notificationService: ChatNotificationService,
		private readonly membersService: ChatMemberService,
		private readonly broadcaster: ChatBroadcaster,
	) {}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.ROOM_JOIN)
	async handleRoomJoin(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatRoomJoinDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(async () => {
			await this.membersService.checkMembership({
				roomId: dto.roomId,
				userId,
			});
			await client.join(dto.roomId);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.ROOM_LEAVE)
	async handleRoomLeave(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatRoomLeaveDto,
	): Promise<WsResponse<void>> {
		return handleWs(async () => {
			await client.leave(dto.roomId);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.MESSAGE_SEND)
	async handleMessageSend(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatMessageCreateDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(async () => {
			await this.messagesService.create(dto.roomId, userId, dto);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.MESSAGE_EDIT)
	async handleEdit(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatMessageEditDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(async () => {
			await this.messagesService.edit(dto, userId);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.MESSAGE_SOFT_DELETE)
	async handleMessageSoftDelete(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatMessageSoftDeleteDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(async () => {
			await this.messagesService.softDelete(dto.messageId, userId);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.TYPING_START)
	handleTypingStart(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatTypingDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(() => {
			this.broadcaster.typingUpdate(client, {
				userId,
				roomId: dto.roomId,
				displayName: client.data.user.displayName,
				isTyping: true,
			});
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.TYPING_STOP)
	handleTypingStop(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatTypingDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;
		return handleWs(() => {
			this.broadcaster.typingUpdate(client, {
				userId,
				roomId: dto.roomId,
				displayName: client.data.user.displayName,
				isTyping: false,
			});
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.NOTIFICATION_MARK_AS_READ)
	handleMarkAsRead(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() payload: ChatNotificationMarkAsReadDto,
	): Promise<WsResponse<void>> {
		const userId = client.data.user.sub;

		return handleWs(async () => {
			const readAt = await this.notificationService.markRoomAsRead(
				userId,
				payload.roomId,
			);

			this.broadcaster.successReadNotification(
				userId,
				payload.roomId,
				readAt,
			);
		});
	}
}
