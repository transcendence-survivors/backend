import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/services/prisma.service';
import { FriendshipState } from '@prisma-generated/enums';
import { PresenceStoreService } from './presence-store.service';
import { PresenceStatus } from '../intefaces/presence.interface';

@Injectable()
export class PresenceService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly store: PresenceStoreService,
	) {}

	async connect(userId: string, socketId: string) {
		const isFirstConnection = this.store.addConnection(userId, socketId);

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				friendshipsA: {
					where: { state: FriendshipState.ACCEPTED },
					select: { userBId: true },
				},
				friendshipsB: {
					where: { state: FriendshipState.ACCEPTED },
					select: { userAId: true },
				},
			},
		});
		const friendIds = user
			? [
					...user.friendshipsA.map((f) => f.userBId),
					...user.friendshipsB.map((f) => f.userAId),
				]
			: [];

		return {
			userId,
			rooms: [
				`user:${userId}`,
				...friendIds.map((id) => `presence:${id}`),
			],
			activeFriends: friendIds.filter((id) =>
				this.store.isUserOnline(id),
			),
			statusChanged: isFirstConnection,
			status: PresenceStatus.ONLINE,
			onlineCount: this.store.getOnlineUserCount(),
		};
	}

	disconnect(socketId: string) {
		const result = this.store.removeConnection(socketId);

		return {
			...result,
			status: PresenceStatus.OFFLINE,
			onlineCount: this.store.getOnlineUserCount(),
		};
	}

	updateStatus(userId: string, status: PresenceStatus) {
		this.store.setStatus(userId, status);

		return {
			userId,
			status,
		};
	}
}
