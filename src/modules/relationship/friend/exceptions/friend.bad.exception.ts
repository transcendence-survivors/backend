import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class BadFriendException extends AppHttpException {
	constructor() {
		super(
			'You cannot add yourself as a friend.',
			'bad_friend_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

class BadFriendAcceptException extends AppHttpException {
	constructor() {
		super(
			'You cannot accept your own friend request.',
			'bad_friend_accept_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export { BadFriendException, BadFriendAcceptException };
