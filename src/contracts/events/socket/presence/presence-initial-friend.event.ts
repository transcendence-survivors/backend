import { PresenceStatusEnum } from '@/modules/presence/types/enums/presence-status.enum';

export class PresenceInitialFriendEvent {
	constructor(
		public readonly id: string,
		public readonly status: PresenceStatusEnum,
	) {}
}
