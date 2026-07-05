import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class SelfFriendRequestSentException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot send a friend request to yourself.',
			messageKey: 'friend_request_self_sent',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfFriendRequestSentException.describe();
		super(message, messageKey, status);
	}
}

export class SelfFriendDeleteException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot delete yourself as a friend.',
			messageKey: 'friend_request_self_delete',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfFriendDeleteException.describe();
		super(message, messageKey, status);
	}
}

export class SelfFriendRequestDeleteException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message:
				'You cannot delete a friend request to yourself because it cannot exist.',
			messageKey: 'friend_request_self_delete',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfFriendRequestDeleteException.describe();
		super(message, messageKey, status);
	}
}
