import { AppHttpException } from '@/shared/filters/app.http.exception';

class FriendNotFoundException extends AppHttpException {
	constructor() {
		super('Friend not found', 'friend.not.found', 404);
	}
}

class FriendRequestDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			'Friend request does not exist',
			'friend_request_does_not_exist',
			404,
		);
	}
}

export { FriendNotFoundException, FriendRequestDoesNotExistException };
