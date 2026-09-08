export * from './user/user-created.event';
export * from './password/password-reset-requested.event';
export * from './friend/friend-request.event';
export * from './block/block-created.event';

export * from './chat/chat-member-joined.event';
export * from './chat/chat-member-left.event';
export * from './chat/chat-member-kicked.event';
export * from './chat/chat-member-role-updated.event';
export * from './chat/chat-message-created.event';
export * from './chat/chat-message-edited.event';
export * from './chat/chat-message-soft-delete.event';
export * from './chat/chat-ownership-transferred.event';
export * from './chat/chat-room-renamed.event';
export * from './chat/chat-room-avatar-changed.event';
export * from './chat/chat-room-created.event';

const FRIEND_PREFIX = 'friend.' as const;
const FriendEvents = {
	FRIEND_REQUEST_SENT: `${FRIEND_PREFIX}request.sent`,
	FRIEND_REQUEST_ACCEPTED: `${FRIEND_PREFIX}request.accepted`,
} as const;

const PRESENCE_PREFIX = 'presence.' as const;
const PresenceEvents = {
	PRESENCE_WENT_OFFLINE: `${PRESENCE_PREFIX}went-offline`,
} as const;

const CHAT_PREFIX = 'chat.' as const;
const ChatEvents = {
	CHAT_MESSAGE_CREATED: `${CHAT_PREFIX}message.created`,
	CHAT_MESSAGE_EDITED: `${CHAT_PREFIX}message.edited`,
	CHAT_MESSAGE_SOFT_DELETED: `${CHAT_PREFIX}message.soft-deleted`,

	CHAT_MEMBER_JOINED: `${CHAT_PREFIX}member.joined`,
	CHAT_MEMBER_LEFT: `${CHAT_PREFIX}member.left`,
	CHAT_MEMBER_KICKED: `${CHAT_PREFIX}member.kicked`,
	CHAT_MEMBER_ROLE_UPDATED: `${CHAT_PREFIX}member.role_updated`,
	CHAT_OWNERSHIP_TRANSFERRED: `${CHAT_PREFIX}ownership.transferred`,

	CHAT_ROOM_RENAMED: `${CHAT_PREFIX}room.renamed`,
	CHAT_ROOM_AVATAR_CHANGED: `${CHAT_PREFIX}room.avatar_changed`,
	CHAT_ROOM_CREATED: `${CHAT_PREFIX}room.created`,
} as const;

export const APP_EVENTS = {
	USER_CREATED: 'user.created',
	PASSWORD_RESET_REQUESTED: 'password.reset.requested',
	BLOCK_CREATED: 'block.created',
	ATTACHMENTS_MUST_BE_DELETED: 'attachments.must-be-deleted',
	...FriendEvents,
	...PresenceEvents,
	...ChatEvents,
} as const;
