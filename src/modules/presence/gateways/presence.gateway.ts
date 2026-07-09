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

import { UseGuards } from '@nestjs/common';
import { PRESENCE_EVENTS } from '@/contracts/events/socket/presence/presence.events';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresencePreferedStatus } from '@prisma-generated/enums';
import { PresenceUpdatedEvent } from '@/contracts/events/socket/presence/presence-updated-friend.event';
import { PresenceCountEvent } from '@/contracts/events/socket/presence/presence-count.event';
import { PresenceInitialFriendEvent } from '@/contracts/events/socket/presence/presence-initial-friend.event';
import { UserListItem } from '@/modules/user/user.public-api';
import { PresenceConnectedEvent } from '@/contracts/events/socket/presence/presence-connected.event';
import { OnEvent } from '@nestjs/event-emitter/dist/decorators/on-event.decorator';
import { AppEvents } from '@/contracts/events/internal';
import { PresenceWentOfflineEvent } from '@/contracts/events/internal/presence-went-offline';

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
		client.emit(
			PRESENCE_EVENTS.SEND.INITIAL_FRIENDS,
			result.activeFriends.map(
				(friend) =>
					new PresenceInitialFriendEvent(friend.id, friend.status),
			),
		);
		client.emit(
			PRESENCE_EVENTS.SEND.INITIAL_STATUS,
			new PresenceInitialFriendEvent(result.user.id, result.status),
		);

		if (
			result.isFirstConnection &&
			result.status !== PresenceStatusEnum.INVISIBLE
		) {
			this.broadcastConnectedToFriends(result.user, result.status);
		}
		this.broadcastOnlineCount(result.onlineCount);
	}

	handleDisconnect(client: ClientSocket) {
		console.log(`Client disconnected: ${client.id}`);
		this.presenceService.disconnect(client.id);
	}

	@OnEvent(AppEvents.PRESENCE_WENT_OFFLINE)
	handleWentOffline(event: PresenceWentOfflineEvent) {
		this.broadcastStatusToFriends(event.userId, PresenceStatusEnum.OFFLINE);
		this.broadcastOnlineCount(event.onlineCount);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_VISIBLE)
	async goVisible(@ConnectedSocket() client: UserSocket) {
		await this.handleStatusChange(
			client.data.user.sub,
			PresenceStatusEnum.ONLINE,
		);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	async goInvisible(@ConnectedSocket() client: UserSocket) {
		await this.handleStatusChange(
			client.data.user.sub,
			PresenceStatusEnum.INVISIBLE,
		);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_DND)
	async goDoNotDisturb(@ConnectedSocket() client: UserSocket) {
		await this.handleStatusChange(
			client.data.user.sub,
			PresenceStatusEnum.DO_NOT_DISTURB,
		);
	}

	private async handleStatusChange(
		userId: string,
		status: PresencePreferedStatus,
	) {
		const result = await this.presenceService.updateStatus(userId, status);

		if (result.broadcastCount)
			this.broadcastOnlineCount(result.onlineCount);
		if (result.broadcastStatus) {
			if (result.newConnection) {
				this.broadcastConnectedToFriends(result.user, result.status);
			} else this.broadcastStatusToFriends(userId, result.status);
		}
	}

	private broadcastStatusToFriends(
		userId: string,
		status: PresenceStatusEnum,
	) {
		this.server
			.to(`presence:${userId}`)
			.emit(
				PRESENCE_EVENTS.SEND.STATUS_CHANGE,
				new PresenceUpdatedEvent(userId, status),
			);
	}

	private broadcastConnectedToFriends(
		user: UserListItem,
		status: PresenceStatusEnum,
	) {
		this.server
			.to(`presence:${user.id}`)
			.emit(
				PRESENCE_EVENTS.SEND.CONNECTED,
				new PresenceConnectedEvent(
					user.id,
					user.username,
					user.displayName,
					user.avatarUrl,
					status,
				),
			);
	}

	private broadcastOnlineCount(count: number) {
		this.server.emit(
			PRESENCE_EVENTS.SEND.GLOBAL_COUNT,
			new PresenceCountEvent(count),
		);
	}
}
