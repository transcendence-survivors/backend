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

@UseGuards(WsJWTAccessGuard)
@WebSocketGateway()
export class PresenceGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly activeConnections = new Map<string, string>();

	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly wsJwtStrategy: WsJWTAccessStrategy,
		private readonly prisma: PrismaService,
	) {}

	private getUniqueOnlineCount(): number {
		return new Set(this.activeConnections.values()).size;
	}

	async handleConnection(client: TypedSocket) {
		try {
			const userPayload = this.wsJwtStrategy.validateSocket(client);
			const userId = userPayload.sub;

			this.activeConnections.set(client.id, userId);
			client.data.user = userPayload;

			await this.syncPresenceSession(client, userId);
			this.server.emit(
				PRESENCE_EVENTS.SEND.GLOBAL_COUNT,
				this.getUniqueOnlineCount(),
			);
		} catch {
			client.disconnect(true);
		}
	}

	handleDisconnect(client: TypedSocket) {
		const userId = this.activeConnections.get(client.id);
		if (!userId) return;

		this.activeConnections.delete(client.id);
		const remainsConnected = Array.from(
			this.activeConnections.values(),
		).includes(userId);

		if (!remainsConnected) {
			this.server
				.to(`presence:${userId}`)
				.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
					userId,
					status: 'offline',
				});
		}
		this.server.emit(
			PRESENCE_EVENTS.SEND.GLOBAL_COUNT,
			this.getUniqueOnlineCount(),
		);
	}

	private async syncPresenceSession(client: Socket, userId: string) {
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

		client
			.to(friendIds.map((id) => `presence:${id}`))
			.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
				userId,
				status: 'online',
			});

		for (const id of friendIds) {
			await client.join(`presence:${id}`);
		}

		await client.join(`user:${userId}`);
		const currentOnlinePool = Array.from(
			new Set(this.activeConnections.values()),
		);
		const activeFriends = friendIds.filter((id) =>
			currentOnlinePool.includes(id),
		);
		client.emit(PRESENCE_EVENTS.SEND.INITIAL_FRIENDS, activeFriends);
	}

	@SubscribeMessage(PRESENCE_EVENTS.RECEIVE.GO_INVISIBLE)
	handleGoInvisible(@ConnectedSocket() client: TypedSocket) {
		const userId = client.data.user?.sub;

		this.server
			.to(`presence:${userId}`)
			.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, {
				userId,
				status: 'offline',
			});
	}
}
