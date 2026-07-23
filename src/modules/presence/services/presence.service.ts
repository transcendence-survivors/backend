import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PresenceStoreService } from './presence-store.service';
import type { IFriendService } from '@/contracts/services/friend/friend-service.port';
import { InjectFriendService } from '@/contracts/services/friend/friend-service.inject';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresenceRepository } from '../repositories/presence.repository';
import { PresenceConnect } from '../types/records/presence-connect.type';
import { PresencePreferedStatus } from '@prisma-generated/enums';
import { PresenceDisconnect } from '../types/records/presence-disconnect.type';
import { PresenceUpdate } from '../types/records/presence-update.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_EVENTS } from '@/contracts/events/internal';
import { PresenceWentOfflineEvent } from '@/contracts/events/internal/presence/presence-went-offline';

@Injectable()
export class PresenceService implements OnModuleDestroy {
	private static readonly DISCONNECT_GRACE_MS = 5_000;

	constructor(
		private readonly store: PresenceStoreService,
		private readonly repo: PresenceRepository,
		private readonly eventEmitter: EventEmitter2,
		@InjectFriendService() private readonly friendService: IFriendService,
	) {}

	onModuleDestroy(): void {
		this.store.clearAllDisconnectTimers();
	}

	async connect(userId: string, socketId: string): Promise<PresenceConnect> {
		const isReconnect = this.store.hasPendingDisconnect(userId);
		this.store.clearDisconnectTimer(userId);
		const isFirstConnection = this.store.addConnection(userId, socketId);
		const reportedFirstConnection = isFirstConnection && !isReconnect;

		const [friendIds, status] = await Promise.all([
			this.friendService.getAllFriendsIds(userId),
			this.repo.getPresenceStatus(userId),
		]);

		const friendsPayload = friendIds
			.map((id) => ({
				id,
				status: this.store.getStatus(id),
			}))
			.filter((friend) => friend.status !== PresenceStatusEnum.OFFLINE);

		const user = {
			id: status?.id ?? userId,
			avatarUrl: status?.avatarUrl ?? '',
			username: status?.username ?? '',
			displayName: status?.displayName ?? '',
		};

		return {
			user: user,
			rooms: [
				`user:${userId}`,
				...friendIds.map((id) => `presence:${id}`),
			],
			activeFriends: friendsPayload,
			isFirstConnection: reportedFirstConnection,
			status: status?.preferedPresenceStatus ?? PresenceStatusEnum.ONLINE,
			onlineCount: this.store.getOnlineUserCount(),
		};
	}

	disconnect(socketId: string): PresenceDisconnect {
		const result = this.store.removeConnection(socketId);

		if (result.userId && result.isCompletelyOffline) {
			this.scheduleOfflineConfirmation(result.userId);
		}

		return {
			...result,
			isCompletelyOffline: false,
			status: PresenceStatusEnum.OFFLINE,
			onlineCount: this.store.getOnlineUserCount(),
		};
	}

	async updateStatus(
		userId: string,
		status: PresencePreferedStatus,
	): Promise<PresenceUpdate> {
		const currentStatus = this.store.getStatus(userId);
		if (currentStatus === status || !currentStatus) {
			return {
				broadcastStatus: false,
				broadcastCount: false,
			};
		}

		this.store.setStatus(userId, status);
		const user = await this.repo.updateStatus({ userId, status });
		const shouldBroadcastCount = this.shouldBroadcastCount(
			currentStatus,
			status,
		);

		if (shouldBroadcastCount) {
			return {
				broadcastStatus: true,
				broadcastCount: true,
				newConnection: this.isVisibleStatus(status),
				user: user,
				status,
				onlineCount: this.store.getOnlineUserCount(),
			};
		}
		return {
			broadcastStatus: true,
			broadcastCount: false,
			newConnection: false,
			status,
		};
	}

	private isVisibleStatus(status: PresenceStatusEnum): boolean {
		return (
			status === PresenceStatusEnum.ONLINE ||
			status === PresenceStatusEnum.DO_NOT_DISTURB
		);
	}
	private shouldBroadcastCount(
		currentStatus: PresenceStatusEnum,
		newStatus: PresenceStatusEnum,
	): boolean {
		return (
			this.isVisibleStatus(currentStatus) !==
			this.isVisibleStatus(newStatus)
		);
	}

	private scheduleOfflineConfirmation(userId: string): void {
		const timer = setTimeout(() => {
			void this.confirmOffline(userId);
		}, PresenceService.DISCONNECT_GRACE_MS).unref();

		this.store.setDisconnectTimer(userId, timer);
	}

	private async confirmOffline(userId: string): Promise<void> {
		this.store.clearDisconnectTimer(userId);

		if (this.store.getSocketsByUserId(userId).length > 0) return;
		try {
			await this.repo.disconnectUser(userId);
		} catch (error) {
			console.error(`Error disconnecting user ${userId}:`, error);
		}
		if (this.store.getSocketsByUserId(userId).length > 0) return;

		this.store.finalizeOffline(userId);
		this.eventEmitter.emit(
			APP_EVENTS.PRESENCE_WENT_OFFLINE,
			new PresenceWentOfflineEvent(
				userId,
				this.store.getOnlineUserCount(),
			),
		);
	}
}
