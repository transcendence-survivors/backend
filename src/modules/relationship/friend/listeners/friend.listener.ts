import { Injectable } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { OnEvent } from '@nestjs/event-emitter';
import { AppEvents, BlockCreatedEvent } from '@/contracts/events/internal';

@Injectable()
export class FriendListener {
	constructor(private readonly service: FriendService) {}

	@OnEvent(AppEvents.BLOCK_CREATED)
	async handleBlockCreated(event: BlockCreatedEvent) {
		const result = await this.service.removeIfExists(
			event.blockerUserId,
			event.blockedUserId,
		);

		if (result.count > 0) {
			// TODO: Emit an event to notify the users that they are no longer friends
		}
	}
}
