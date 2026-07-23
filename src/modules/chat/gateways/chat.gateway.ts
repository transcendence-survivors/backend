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
import { CreateMessageDto } from '../message/dtos/requests/chat-message-create.dto';
import { UseGuards } from '@nestjs/common';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { type UserSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { ChatBroadcaster } from '../broadcasters/chat.broadcaster';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly broadcaster: ChatBroadcaster,
		private messagesService: ChatMessageService,
	) {}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(CHAT_EVENTS.RECEIVE.MESSAGE_SEND)
	async handleMessageSend(
		@ConnectedSocket() client: UserSocket,
		@MessageBody() dto: CreateMessageDto,
	) {
		const message = await this.messagesService.create(
			dto.roomId,
			client.data.user.sub,
			dto,
		);

		this.broadcaster.messageNew(message);
	}
}
