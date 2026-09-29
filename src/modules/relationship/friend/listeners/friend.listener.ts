import { Injectable } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
	APP_EVENTS,
	BlockCreatedEvent,
	FriendRequestAcceptedEvent,
} from '@/contracts/events/internal';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { FriendBroadcaster } from '../broadcaster/friend.broadcaster';

@Injectable()
export class FriendListener {
	constructor(
		private readonly service: FriendService,
		private readonly broadcaster: FriendBroadcaster,
		@InjectUserService() private readonly user: IUserService,
	) {}

	@OnEvent(APP_EVENTS.BLOCK_CREATED)
	async handleBlockCreated(event: BlockCreatedEvent) {
		const count = await this.service.removeIfExists(
			event.blockerUserId,
			event.blockedUserId,
		);

		if (count > 0) {
			// TODO: Emit an event to notify the users that they are no longer friends
		}
	}

	@OnEvent(APP_EVENTS.FRIEND_REQUEST_ACCEPTED)
	async handleFriendRequestAccepted(event: FriendRequestAcceptedEvent) {
		const sender = await this.user.getItemById(event.senderUserId);
		this.broadcaster.notifyFriendRequestAccepted(
			sender,
			event.receiverUserId,
		);
	}

	@OnEvent(APP_EVENTS.FRIEND_REQUEST_SENT)
	async handleFriendRequestSent(event: FriendRequestAcceptedEvent) {
		const sender = await this.user.getItemById(event.senderUserId);
		this.broadcaster.notifyFriendRequestReceived(
			sender,
			event.receiverUserId,
		);
	}
}
