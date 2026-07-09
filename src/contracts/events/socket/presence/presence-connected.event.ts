import { PresenceStatusEnum } from '@/modules/presence/types/enums/presence-status.enum';

export class PresenceConnectedEvent {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly displayName: string,
		public readonly avatarUrl: string | null,
		public readonly status: PresenceStatusEnum,
	) {}
}
