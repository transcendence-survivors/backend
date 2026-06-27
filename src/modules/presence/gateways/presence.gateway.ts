import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { PresenceService } from '../services/presence.service';
import {
	type ClientSocket,
	type UserSocket,
} from '@/core/websocket/interface/ws-socket.inteface';

import { PresenceStatus } from '../intefaces/presence.interface';
import { UseGuards } from '@nestjs/common';
import { PRESENCE_EVENTS } from '@/contracts/events/socket/presence.events';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';

@WebSocketGateway()
export class PresenceGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	constructor(private readonly presenceService: PresenceService) {}

	async handleConnection(client: ClientSocket) {
		const userId = client.data.user?.sub;
		if (!userId) return;

		const result = await this.presenceService.connect(userId, client.id);
		for (const room of result.rooms) {
			await client.join(room);
		}
		client.emit(PRESENCE_EVENTS.SEND.INITIAL_FRIENDS, result.activeFriends);

		if (result.statusChanged)
			this.broadcastStatus(result.userId, result.status);
		this.broadcastOnlineCount(result.onlineCount);
	}

	handleDisconnect(client: ClientSocket) {
		const result = this.presenceService.disconnect(client.id);

		if (!result.userId) return;
		if (result.isCompletelyOffline) {
			this.broadcastStatus(result.userId, PresenceStatus.OFFLINE);
		}
		this.broadcastOnlineCount(result.onlineCount);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_VISIBLE)
	GoVisible(@ConnectedSocket() client: UserSocket) {
		this.handleStatusChange(client.data.user.sub, PresenceStatus.ONLINE);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	GoInvisible(@ConnectedSocket() client: UserSocket) {
		this.handleStatusChange(client.data.user.sub, PresenceStatus.INVISIBLE);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_DND)
	GoDoNotDisturb(@ConnectedSocket() client: UserSocket) {
		this.handleStatusChange(
			client.data.user.sub,
			PresenceStatus.DO_NOT_DISTURB,
		);
	}

	private handleStatusChange(userId: string, status: PresenceStatus) {
		const result = this.presenceService.updateStatus(userId, status);

		if (result.broadcastCount)
			this.broadcastOnlineCount(result.onlineCount);
		if (result.broadcastStatus)
			this.broadcastStatus(result.userId, result.status);
	}

	private broadcastStatus(userId: string, status: PresenceStatus) {
		this.server
			.to(`presence:${userId}`)
			.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
				userId,
				status,
			});
	}

	private broadcastOnlineCount(count: number) {
		this.server.emit(PRESENCE_EVENTS.SEND.GLOBAL_COUNT, count);
	}
}
