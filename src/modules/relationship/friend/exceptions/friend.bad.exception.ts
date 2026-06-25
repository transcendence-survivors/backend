import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class BadAddFriendException extends AppHttpException {
	constructor() {
		super(
			'You cannot add yourself as a friend.',
			'bad_friend_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

class BadFriendDeleteException extends AppHttpException {
	constructor() {
		super(
			'You cannot delete yourself as a friend.',
			'bad_friend_delete',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export { BadAddFriendException, BadFriendDeleteException };
