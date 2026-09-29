import { ChatMemberRole } from '@prisma-generated/enums';

export interface ChatMembership {
	roomId: string;
	role: ChatMemberRole;
}
