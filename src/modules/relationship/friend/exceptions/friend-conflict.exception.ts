import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class FriendAlreadyExistsException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Friend already exists',
			messageKey: 'friendship_already_exists',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendAlreadyExistsException.describe();
		super(message, messageKey, status);
	}
}

export class FriendRequestAlreadySentException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Friend request already sent',
			messageKey: 'friendship_request_already_sent',
		};
	}
	constructor() {
		const { message, messageKey, status } =
			FriendRequestAlreadySentException.describe();
		super(message, messageKey, status);
	}
}
