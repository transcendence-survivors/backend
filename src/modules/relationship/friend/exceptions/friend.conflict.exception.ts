import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class FriendAlreadyExistsException extends AppHttpException {
	constructor() {
		super(
			'Friend already exists',
			'friend_already_exists',
			HttpStatus.CONFLICT,
		);
	}
}

class FriendRequestAlreadySentException extends AppHttpException {
	constructor() {
		super(
			'Friend request already sent',
			'friend_request_already_sent',
			HttpStatus.CONFLICT,
		);
	}
}

export { FriendAlreadyExistsException, FriendRequestAlreadySentException };
