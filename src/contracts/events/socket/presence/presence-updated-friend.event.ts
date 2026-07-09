import { PresenceStatusEnum } from '@/modules/presence/types/enums/presence-status.enum';

export class PresenceUpdatedEvent {
	constructor(
		public readonly id: string,
		public readonly status: PresenceStatusEnum,
	) {}
}
