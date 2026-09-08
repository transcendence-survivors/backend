import { ChatMemberRole } from '@prisma-generated/enums';

export class ChatMemberRoleUpdatedEvent {
	constructor(
		public readonly roomId: string,
		public readonly actorId: string,
		public readonly targetUserId: string,
		public readonly newRole: ChatMemberRole,
		public readonly oldRole: ChatMemberRole,
	) {}
}
