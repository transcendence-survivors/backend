import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class FriendDoesNotExistException extends AppHttpException {
	constructor() {
		super('Friend not found', 'friendship_not_found', HttpStatus.NOT_FOUND);
	}
}

class FriendRequestDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			'Friend request does not exist',
			'friendship_request_not_found',
			HttpStatus.NOT_FOUND,
		);
	}
}

export { FriendDoesNotExistException, FriendRequestDoesNotExistException };
