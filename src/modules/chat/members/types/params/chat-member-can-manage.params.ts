import { ChatMemberRole } from '@prisma-generated/enums';
import { ChatMemberPermissionEnum } from '../enums/chat-member-permission.enum';

export interface ChatMemberCanManageParams {
	actorRole: ChatMemberRole;
	targetRole: ChatMemberRole;
	permission: ChatMemberPermissionEnum;
	desiredRole?: ChatMemberRole;
}
