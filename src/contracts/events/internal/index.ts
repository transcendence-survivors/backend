export * from './user-created.event';
export * from './password-reset-requested.event';
export * from './friend-request.event';
export * from './block-created.event';

export const AppEvents = {
	USER_CREATED: 'user.created',
	PASSWORD_RESET_REQUESTED: 'password.reset.requested',
	BLOCK_CREATED: 'block.created',
	FRIEND_REQUEST_SENT: 'friend.request.sent',
	FRIEND_REQUEST_ACCEPTED: 'friend.request.accepted',

	PRESENCE_WENT_OFFLINE: 'presence.went-offline',
} as const;
