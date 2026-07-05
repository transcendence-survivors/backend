import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class FriendDoesNotExistException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Friend not found',
			messageKey: 'friendship_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendDoesNotExistException.describe();
		super(message, messageKey, status);
	}
}

export class FriendRequestDoesNotExistException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Friend request does not exist',
			messageKey: 'friendship_request_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendRequestDoesNotExistException.describe();
		super(message, messageKey, status);
	}
}
