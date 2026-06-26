import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { WsJWTAccessStrategy } from '@/core/security/strategies/jwt-access.strategy';
import { PrismaService } from '@/core/database/services/prisma.service';
import { type TypedSocket } from '@/core/security/interfaces/ws-socket.inteface';
import { FriendshipState } from '@prisma-generated/enums';
import { PRESENCE_EVENTS } from '@/contracts/events/socket/presence.events';
import { PresenceStoreService } from '../services/presence-store.service';

@UseGuards(WsJWTAccessGuard)
@WebSocketGateway()
export class PresenceGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly wsJwtStrategy: WsJWTAccessStrategy,
		private readonly prisma: PrismaService,
		private readonly store: PresenceStoreService,
	) {}

	private updateStatusForFriends(
		userId: string,
		status: 'online' | 'offline',
	) {
		this.server
			.to(`presence:${userId}`)
			.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
				userId,
				status,
			});
	}

	private updateGlobalCount() {
		this.server.emit(
			PRESENCE_EVENTS.SEND.GLOBAL_COUNT,
			this.store.getOnlineUserCount(),
		);
	}

	async handleConnection(client: TypedSocket) {
		try {
			const userPayload = this.wsJwtStrategy.validateSocket(client);
			const userId = userPayload.sub;

			const isFirstTab = this.store.addConnection(userId, client.id);
			client.data.user = userPayload;

			await this.syncPresenceSession(client, userId, isFirstTab);
			this.updateGlobalCount();
		} catch {
			client.disconnect(true);
		}
	}

	handleDisconnect(client: TypedSocket) {
		const { userId, isCompletelyOffline } = this.store.removeConnection(
			client.id,
		);
		if (!userId) return;
		if (isCompletelyOffline) {
			this.updateStatusForFriends(userId, 'offline');
		}
		this.updateGlobalCount();
	}

	private async syncPresenceSession(
		client: Socket,
		userId: string,
		isFirstTab: boolean,
	) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				friendshipsA: {
					where: { state: FriendshipState.ACCEPTED },
					select: {
						userBId: true,
					},
				},
				friendshipsB: {
					where: { state: FriendshipState.ACCEPTED },
					select: {
						userAId: true,
					},
				},
			},
		});
		if (!user) return;

		const friendIds = [
			...user.friendshipsA.map((f) => f.userBId),
			...user.friendshipsB.map((f) => f.userAId),
		];
		if (friendIds.length === 0) return;

		if (isFirstTab) {
			client
				.to(friendIds.map((id) => `presence:${id}`))
				.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
					userId,
					status: 'online',
				});
		}

		friendIds.forEach((id) => void client.join(`presence:${id}`));
		void client.join(`user:${userId}`);

		const activeFriends = friendIds.filter((id) =>
			this.store.isUserOnline(id),
		);
		client.emit(PRESENCE_EVENTS.SEND.INITIAL_FRIENDS, activeFriends);
	}

	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	handleGoInvisible(@ConnectedSocket() client: TypedSocket) {
		const userId = client.data.user?.sub;
		if (!userId) return;

		this.updateStatusForFriends(userId, 'offline');
	}
}
