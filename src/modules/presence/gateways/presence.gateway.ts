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

import { UseFilters, UseGuards } from '@nestjs/common';
import { PRESENCE_EVENTS } from '../presence.events';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresencePreferedStatus } from '@prisma-generated/enums';
import { PresenceBroadcaster } from '../broadcasters/presence.broadcaster';
import { WsExceptionsFilter } from '@/shared/filters/ws-exception.filter';
import { handleWs } from '@/shared/utils/exceptions.utils';

@UseFilters(WsExceptionsFilter)
@WebSocketGateway()
export class PresenceGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly service: PresenceService,
		private readonly broadcaster: PresenceBroadcaster,
	) {}

	async handleConnection(client: ClientSocket) {
		const userId = client.data.user?.sub;
		if (!userId) return;

		const result = await this.service.connect(userId, client.id);

		for (const room of result.rooms) await client.join(room);
		this.broadcaster.sendInitialState(client, {
			user: result.user,
			activeFriends: result.activeFriends,
			status: result.status,
		});

		const needConnectedBroadcast =
			result.isFirstConnection &&
			result.status !== PresenceStatusEnum.INVISIBLE;

		if (needConnectedBroadcast) {
			this.broadcaster.broadcastConnectedToFriends(
				result.user,
				result.status,
			);
		}
		this.broadcaster.broadcastOnlineCount(result.onlineCount);
	}

	handleDisconnect(client: ClientSocket) {
		this.service.disconnect(client.id);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_VISIBLE)
	async goVisible(@ConnectedSocket() client: UserSocket) {
		return handleWs(async () => {
			return await this.handleStatusChange(
				client.data.user.sub,
				PresenceStatusEnum.ONLINE,
			);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	async goInvisible(@ConnectedSocket() client: UserSocket) {
		return handleWs(async () => {
			return await this.handleStatusChange(
				client.data.user.sub,
				PresenceStatusEnum.INVISIBLE,
			);
		});
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_DND)
	async goDoNotDisturb(@ConnectedSocket() client: UserSocket) {
		return handleWs(async () => {
			return await this.handleStatusChange(
				client.data.user.sub,
				PresenceStatusEnum.DO_NOT_DISTURB,
			);
		});
	}

	private async handleStatusChange(
		userId: string,
		status: PresencePreferedStatus,
	) {
		const result = await this.service.updateStatus(userId, status);

		if (result.broadcastCount)
			this.broadcaster.broadcastOnlineCount(result.onlineCount);
		if (result.broadcastStatus) {
			if (result.newConnection) {
				this.broadcaster.broadcastConnectedToFriends(
					result.user,
					result.status,
				);
			} else
				this.broadcaster.broadcastStatusToFriends(
					userId,
					result.status,
				);
		}
	}
}
