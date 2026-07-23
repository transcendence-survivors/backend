import { Injectable } from '@nestjs/common';
import { PresenceBroadcaster } from '../broadcasters/presence.broadcaster';
import { APP_EVENTS } from '@/contracts/events/internal';
import { OnEvent } from '@nestjs/event-emitter';
import { PresenceWentOfflineEvent } from '@/contracts/events/internal/presence/presence-went-offline';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';

@Injectable()
export class PresenceListener {
	constructor(private readonly broadcaster: PresenceBroadcaster) {}

	@OnEvent(APP_EVENTS.PRESENCE_WENT_OFFLINE)
	handleWentOffline(event: PresenceWentOfflineEvent) {
		this.broadcaster.broadcastStatusToFriends(
			event.userId,
			PresenceStatusEnum.OFFLINE,
		);
		this.broadcaster.broadcastOnlineCount(event.onlineCount);
	}
}
