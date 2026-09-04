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
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type UserSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { WsExceptionsFilter } from '@/shared/filters/ws-exception.filter';
import { handleWs } from '@/shared/utils/exceptions.utils';
import { ChatMessageSoftDeleteDto } from '../message/dtos/requests/chat-message-softdelete';
import { ChatMessageEditDto } from '../message/dtos/requests/chat-message-edit.dto';
import { ChatMemberService } from '../members/services/chat-member.service';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';
import { ChatTypingDto } from '../dtos/requests/chat-typing.dto';

@UseFilters(WsExceptionsFilter)
@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly messagesService: ChatMessageService,
		private readonly membersService: ChatMemberService,
		private readonly broadcaster: ChatBroadcaster,
	) {}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.ROOM_JOIN)
	async handleRoomJoin(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: { roomId: string },
	) {
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
		@MessageBody() dto: { roomId: string },
	) {
		return handleWs(async () => {
			await client.leave(dto.roomId);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.MESSAGE_SEND)
	async handleMessageSend(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: ChatMessageCreateDto,
	) {
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
	) {
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
	) {
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
	) {
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
	) {
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
}
