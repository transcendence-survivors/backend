import { ChatMemberRole, ChatMessageType } from '@prisma-generated/enums';

interface LeftParams {
	type: Extract<ChatMessageType, 'LEFT'>;
	targetUserId: string;
}

interface JoinedParams {
	type: Extract<ChatMessageType, 'JOINED'>;
	senderId: string;
	targetUserId: string;
}

interface RoleUpdatedParams {
	type: Extract<ChatMessageType, 'ROLE_UPDATED'>;
	senderId: string;
	targetUserId: string;
	oldRole: ChatMemberRole;
	newRole: ChatMemberRole;
}

interface KickedParams {
	type: Extract<ChatMessageType, 'KICKED'>;
	senderId: string;
	targetUserId: string;
}

interface NameChangedParams {
	type: Extract<ChatMessageType, 'ROOM_RENAMED'>;
	senderId: string;
	oldValue: string;
	newValue: string;
}

interface AvatarChangedParams {
	type: Extract<ChatMessageType, 'ROOM_AVATAR_CHANGED'>;
	senderId: string;
	oldValue: string;
	newValue: string;
}

interface OwnershipTransferredParams {
	type: Extract<ChatMessageType, 'OWNERSHIP_TRANSFERRED'>;
	senderId: string;
	targetUserId: string;
	oldRole: ChatMemberRole;
	newRole: ChatMemberRole;
}

interface RoomCreatedParams {
	type: Extract<ChatMessageType, 'ROOM_CREATED'>;
	senderId: string;
}

export type ChatMessageCreateSystemParams = {
	roomId: string;
} & (
	| KickedParams
	| LeftParams
	| JoinedParams
	| RoleUpdatedParams
	| NameChangedParams
	| AvatarChangedParams
	| OwnershipTransferredParams
	| RoomCreatedParams
);
