import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class FriendshipBlockedByUserException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'Friendship cannot be created because the user has blocked you.',
			messageKey: 'friendship_blocked_by_user',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendshipBlockedByUserException.describe();
		super(message, messageKey, status);
	}
}

export class FriendshipBlockedByYouException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'Friendship cannot be created because you have blocked the user.',
			messageKey: 'friendship_blocked_by_you',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendshipBlockedByYouException.describe();
		super(message, messageKey, status);
	}
}
