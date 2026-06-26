import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class SelfFriendRequestSentException extends AppHttpException {
	constructor() {
		super(
			'You cannot send a friend request to yourself.',
			'friend_request_self_sent',
			HttpStatus.BAD_REQUEST,
		);
	}
}

class SelfFriendDeleteException extends AppHttpException {
	constructor() {
		super(
			'You cannot delete yourself as a friend.',
			'friend_request_self_delete',
			HttpStatus.BAD_REQUEST,
		);
	}
}

class SelfFriendRequestDeleteException extends AppHttpException {
	constructor() {
		super(
			'You cannot delete a friend request to yourself because it cannot exist.',
			'friend_request_self_delete',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export {
	SelfFriendRequestSentException,
	SelfFriendDeleteException,
	SelfFriendRequestDeleteException,
};
