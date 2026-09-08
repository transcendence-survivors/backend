import { ChatMemberRole } from '@prisma-generated/enums';

export class ChatOwnershipTransferredEvent {
	constructor(
		public readonly roomId: string,
		public readonly senderId: string,
		public readonly targetUserId: string,
		public readonly oldRole: ChatMemberRole,
		public readonly newRole: ChatMemberRole,
	) {}
}
