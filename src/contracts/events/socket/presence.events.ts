const PRESENCE_EVENTS = {
	RECEIVE: {
		GO_INVISIBLE: 'go_invisible',
		FORCE_ONLINE: 'force_online',
	},

	SEND: {
		GLOBAL_COUNT: 'global_online_count',
		STATUS_CHANGE: 'friend_status_change',
		INITIAL_FRIENDS: 'initial_online_friends',
	},
} as const;

type PresenceReceiveEvent =
	(typeof PRESENCE_EVENTS.RECEIVE)[keyof typeof PRESENCE_EVENTS.RECEIVE];
type PresenceSendEvent =
	(typeof PRESENCE_EVENTS.SEND)[keyof typeof PRESENCE_EVENTS.SEND];

export { PRESENCE_EVENTS };
export type { PresenceReceiveEvent, PresenceSendEvent };
