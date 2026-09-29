const FRIEND_PREFIX = 'friend:';

const FRIEND_EVENTS = {
	RECEIVE: {},
	SEND: {
		NOTIFICATION_REQUEST_ACCEPTED: `${FRIEND_PREFIX}notification-request-accepted`,
		NOTIFICATION_REQUEST_RECEIVED: `${FRIEND_PREFIX}notification-request-received`,
	},
} as const;

type FriendReceiveEvent =
	(typeof FRIEND_EVENTS.RECEIVE)[keyof typeof FRIEND_EVENTS.RECEIVE];
type FriendSendEvent =
	(typeof FRIEND_EVENTS.SEND)[keyof typeof FRIEND_EVENTS.SEND];

export { FRIEND_EVENTS };
export type { FriendReceiveEvent, FriendSendEvent };
