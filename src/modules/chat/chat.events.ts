const CHAT_PREFIX = 'chat:';
const MESSAGE_PREFIX = `${CHAT_PREFIX}message`;
const TYPING_PREFIX = `${CHAT_PREFIX}typing`;
const ROOM_PREFIX = `${CHAT_PREFIX}room`;
const MEMBER_PREFIX = `${CHAT_PREFIX}member`;

const CHAT_EVENTS = {
	RECEIVE: {
		MESSAGE_SEND: `${MESSAGE_PREFIX}:send`,
		MESSAGE_EDIT: `${MESSAGE_PREFIX}:edit`,
		MESSAGE_SOFT_DELETE: `${MESSAGE_PREFIX}:soft-delete`,

		NOTIFICATION_MARK_AS_READ: `${MESSAGE_PREFIX}:notification-mark-as-read`,

		TYPING_START: `${TYPING_PREFIX}:start`,
		TYPING_STOP: `${TYPING_PREFIX}:stop`,

		ROOM_JOIN: `${ROOM_PREFIX}:join`,
		ROOM_LEAVE: `${ROOM_PREFIX}:leave`,
	},

	SEND: {
		MESSAGE_NEW: `${MESSAGE_PREFIX}:new`,
		MESSAGE_EDITED: `${MESSAGE_PREFIX}:edited`,
		MESSAGE_SOFT_DELETED: `${MESSAGE_PREFIX}:soft-deleted`,

		NOTIFICATION_MESSAGE_NEW: `${MESSAGE_PREFIX}:notification-message-new`,
		NOTIFICATION_MEMBER_MUTATION: `${MESSAGE_PREFIX}:notification-member-mutation`,
		NOTIFICATION_READ: `${MESSAGE_PREFIX}:notification-read`,

		TYPING_UPDATE: `${TYPING_PREFIX}:update`,

		ROOM_RENAMED: `${ROOM_PREFIX}:renamed`,
		ROOM_AVATAR_CHANGED: `${ROOM_PREFIX}:avatar-changed`,

		MEMBER_ADDED: `${MEMBER_PREFIX}:added`,
		MEMBER_REMOVED: `${MEMBER_PREFIX}:removed`,
		MEMBER_ROLE_UPDATED: `${MEMBER_PREFIX}:role-updated`,
	},
} as const;

type ChatReceiveEvent =
	(typeof CHAT_EVENTS.RECEIVE)[keyof typeof CHAT_EVENTS.RECEIVE];
type ChatSendEvent = (typeof CHAT_EVENTS.SEND)[keyof typeof CHAT_EVENTS.SEND];

export { CHAT_EVENTS };
export type { ChatReceiveEvent, ChatSendEvent };
