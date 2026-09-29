import { Injectable } from '@nestjs/common';
import { PresenceBroadcaster } from '../broadcasters/presence.broadcaster';
import {
	APP_EVENTS,
	FriendRequestAcceptedEvent,
} from '@/contracts/events/internal';
import { OnEvent } from '@nestjs/event-emitter';
import { PresenceWentOfflineEvent } from '@/contracts/events/internal/presence/presence-went-offline';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresenceService } from '../services/presence.service';
import { PresenceStoreService } from '../services/presence-store.service';

@Injectable()
export class PresenceListener {
	constructor(
		private readonly service: PresenceService,
		private readonly store: PresenceStoreService,
		private readonly broadcaster: PresenceBroadcaster,
	) {}

	@OnEvent(APP_EVENTS.PRESENCE_WENT_OFFLINE)
	handleWentOffline(event: PresenceWentOfflineEvent) {
		this.broadcaster.broadcastStatusToFriends(
			event.userId,
			PresenceStatusEnum.OFFLINE,
		);
		this.broadcaster.broadcastOnlineCount(event.onlineCount);
	}

	@OnEvent(APP_EVENTS.FRIEND_REQUEST_ACCEPTED)
	async handleFriendRequestAccepted(event: FriendRequestAcceptedEvent) {
		const { senderUserId, receiverUserId } = event;

		const [senderProfile, receiverProfile] = await Promise.all([
			this.service.getPublicUser(senderUserId),
			this.service.getPublicUser(receiverUserId),
		]);

		const senderStatus = this.store.getStatus(senderUserId);
		const receiverStatus = this.store.getStatus(receiverUserId);

		this.broadcaster.syncNewFriendship(
			{ profile: senderProfile, status: senderStatus },
			{ profile: receiverProfile, status: receiverStatus },
		);
	}
}
