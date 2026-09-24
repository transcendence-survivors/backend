import { Injectable } from '@nestjs/common';
import { ChatMemberRole } from '@prisma-generated/enums';
import { ChatMemberPermissionEnum } from '../types/enums/chat-member-permission.enum';
import { ChatMemberCanManageParams } from '../types/params/chat-member-can-manage.params';

@Injectable()
export class ChatMemberPermissionService {
	private readonly roleHierarchy: Record<ChatMemberRole, number> = {
		[ChatMemberRole.OWNER]: 3,
		[ChatMemberRole.ADMIN]: 2,
		[ChatMemberRole.MEMBER]: 1,
	};

	private readonly rolePermissions: Record<
		ChatMemberRole,
		ChatMemberPermissionEnum[]
	> = {
		[ChatMemberRole.OWNER]: [
			ChatMemberPermissionEnum.MEMBER_PROMOTE,
			ChatMemberPermissionEnum.MEMBER_DEMOTE,
			ChatMemberPermissionEnum.MEMBER_KICK,
		],
		[ChatMemberRole.ADMIN]: [ChatMemberPermissionEnum.MEMBER_KICK],
		[ChatMemberRole.MEMBER]: [],
	};

	canManageMember(params: ChatMemberCanManageParams): boolean {
		const { actorRole, targetRole, permission, desiredRole } = params;

		const hasPermission =
			this.rolePermissions[actorRole]?.includes(permission);
		if (!hasPermission) return false;

		const actorLevel = this.roleHierarchy[actorRole];
		const targetLevel = this.roleHierarchy[targetRole];

		if (actorLevel <= targetLevel) return false;
		if (desiredRole) {
			const desiredLevel = this.roleHierarchy[desiredRole];
			if (actorLevel <= desiredLevel) return false;
		}
		return true;
	}

	getRoleRank(role: ChatMemberRole): number {
		return this.roleHierarchy[role] ?? 0;
	}
}
