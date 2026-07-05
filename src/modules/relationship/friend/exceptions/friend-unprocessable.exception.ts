import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class FriendRequestSelfAcceptException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNPROCESSABLE_ENTITY,
			message: 'You cannot accept your own friend request.',
			messageKey: 'friendship_self_accept',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			FriendRequestSelfAcceptException.describe();
		super(message, messageKey, status);
	}
}
