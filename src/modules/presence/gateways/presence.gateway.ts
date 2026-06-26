import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsJWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { PrismaService } from '@/core/database/services/prisma.service';
import {
	ClientSocket,
	type UserSocket,
} from '@/core/websocket/interface/ws-socket.inteface';
import { FriendshipState } from '@prisma-generated/enums';
import { PRESENCE_EVENTS } from '@/contracts/events/socket/presence.events';
import { PresenceStoreService } from '../services/presence-store.service';

@WebSocketGateway()
export class PresenceGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly prisma: PrismaService,
		private readonly store: PresenceStoreService,
	) {}

	async handleConnection(client: ClientSocket) {
		const userId = client.data.user?.sub;
		if (!userId) return;

		const isFirstSession = this.store.addConnection(userId, client.id);
		await this.syncPresenceSession(client, userId, isFirstSession);
		this.updateGlobalCount();
	}

	handleDisconnect(client: ClientSocket) {
		const { userId, isCompletelyOffline } = this.store.removeConnection(
			client.id,
		);
		if (!userId) return;
		if (isCompletelyOffline) {
			this.updateStatusForFriends(userId, 'offline');
		}
		this.updateGlobalCount();
	}

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

	private async syncPresenceSession(
		client: ClientSocket,
		userId: string,
		isFirstSession: boolean,
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
		if (isFirstSession) this.updateStatusForFriends(userId, 'online');

		friendIds.forEach((id) => void client.join(`presence:${id}`));
		void client.join(`user:${userId}`);

		const activeFriends = friendIds.filter((id) =>
			this.store.isUserOnline(id),
		);
		client.emit(PRESENCE_EVENTS.SEND.INITIAL_FRIENDS, activeFriends);
	}

	@UseGuards(WsJWTAccessGuard)
	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	handleGoInvisible(@ConnectedSocket() client: UserSocket) {
		const userId = client.data.user?.sub;
		if (!userId) return;

		this.updateStatusForFriends(userId, 'offline');
	}
}
