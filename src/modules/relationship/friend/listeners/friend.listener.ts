import { Injectable } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_EVENTS, BlockCreatedEvent } from '@/contracts/events/internal';

@Injectable()
export class FriendListener {
	constructor(private readonly service: FriendService) {}

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
}
