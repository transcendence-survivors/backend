const CHAT_PREFIX = 'chat:';
const MESSAGE_PREFIX = `${CHAT_PREFIX}message`;
const TYPING_PREFIX = `${CHAT_PREFIX}typing`;
const ROOM_PREFIX = `${CHAT_PREFIX}room`;
const MEMBER_PREFIX = `${CHAT_PREFIX}member`;

const CHAT_EVENTS = {
	RECEIVE: {
		MESSAGE_SEND: `${MESSAGE_PREFIX}:send`,
		MESSAGE_READ: `${MESSAGE_PREFIX}:read`,

		TYPING_START: `${TYPING_PREFIX}:start`,
		TYPING_STOP: `${TYPING_PREFIX}:stop`,

		ROOM_JOIN: `${ROOM_PREFIX}:join`,
		ROOM_LEAVE: `${ROOM_PREFIX}:leave`,
	},

	SEND: {
		MESSAGE_NEW: `${MESSAGE_PREFIX}:new`,
		MESSAGE_UPDATED: `${MESSAGE_PREFIX}:updated`,
		MESSAGE_SOFT_DELETED: `${MESSAGE_PREFIX}:soft-deleted`,
		MESSAGE_READ_UPDATE: `${MESSAGE_PREFIX}:read:update`,
		TYPING_UPDATE: `${TYPING_PREFIX}:update`,

		ROOM_UPDATED: `${ROOM_PREFIX}:updated`,
		ROOM_DELETED: `${ROOM_PREFIX}:deleted`,

		MEMBER_ADDED: `${MEMBER_PREFIX}:added`,
		MEMBER_REMOVED: `${MEMBER_PREFIX}:removed`,
	},
} as const;

type ChatReceiveEvent =
	(typeof CHAT_EVENTS.RECEIVE)[keyof typeof CHAT_EVENTS.RECEIVE];
type ChatSendEvent = (typeof CHAT_EVENTS.SEND)[keyof typeof CHAT_EVENTS.SEND];

export { CHAT_EVENTS };
export type { ChatReceiveEvent, ChatSendEvent };
