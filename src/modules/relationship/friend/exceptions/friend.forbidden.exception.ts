import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class FriendshipBlockedByUserException extends AppHttpException {
	constructor() {
		super(
			'Friendship cannot be created because the user has blocked you.',
			'friendship_blocked_by_user',
			HttpStatus.FORBIDDEN,
		);
	}
}

class FriendshipBlockedByYouException extends AppHttpException {
	constructor() {
		super(
			'Friendship cannot be created because you have blocked the user.',
			'friendship_blocked_by_you',
			HttpStatus.FORBIDDEN,
		);
	}
}

export { FriendshipBlockedByUserException, FriendshipBlockedByYouException };
