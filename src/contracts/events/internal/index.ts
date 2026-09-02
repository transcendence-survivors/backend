export * from './user/user-created.event';
export * from './password/password-reset-requested.event';
export * from './friend/friend-request.event';
export * from './block/block-created.event';

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
	CHAT_MEMBER_ADDED: `${CHAT_PREFIX}member.added`,
	CHAT_MEMBER_REMOVED: `${CHAT_PREFIX}member.removed`,
} as const;

export const APP_EVENTS = {
	USER_CREATED: 'user.created',
	PASSWORD_RESET_REQUESTED: 'password.reset.requested',
	BLOCK_CREATED: 'block.created',
	...FriendEvents,
	...PresenceEvents,
	...ChatEvents,
} as const;
