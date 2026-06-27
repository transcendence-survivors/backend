import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/services/prisma.service';
import { FriendshipState } from '@prisma-generated/enums';
import { PresenceStoreService } from './presence-store.service';
import { PresenceStatus } from '../intefaces/presence.interface';

type UpdateStatusResult =
	| { broadcastStatus: false; broadcastCount: false }
	| ({ broadcastStatus: true; userId: string; status: PresenceStatus } & (
			| { broadcastCount: true; onlineCount: number }
			| { broadcastCount: false }
	  ));

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

	private isVisibleStatus(status: PresenceStatus): boolean {
		return (
			status === PresenceStatus.ONLINE ||
			status === PresenceStatus.DO_NOT_DISTURB
		);
	}
	private shouldBroadcastCount(
		currentStatus: PresenceStatus,
		newStatus: PresenceStatus,
	): boolean {
		return (
			this.isVisibleStatus(currentStatus) !==
			this.isVisibleStatus(newStatus)
		);
	}

	updateStatus(userId: string, status: PresenceStatus): UpdateStatusResult {
		const currentStatus = this.store.getStatus(userId);
		if (currentStatus === status || !currentStatus) {
			return {
				broadcastStatus: false,
				broadcastCount: false,
			};
		}
		this.store.setStatus(userId, status);
		const shouldBroadcastCount = this.shouldBroadcastCount(
			currentStatus,
			status,
		);

		if (shouldBroadcastCount) {
			return {
				broadcastStatus: true,
				broadcastCount: true,
				userId,
				status,
				onlineCount: this.store.getOnlineUserCount(),
			};
		}
		return {
			broadcastStatus: true,
			broadcastCount: false,
			userId,
			status,
		};
	}
}
