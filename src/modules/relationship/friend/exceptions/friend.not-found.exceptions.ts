import { AppHttpException } from '@/shared/filters/app.http.exception';

class FriendNotFoundException extends AppHttpException {
	constructor() {
		super('Friend not found', 'friend.not.found', 404);
	}
}

class FriendRequestNotFoundException extends AppHttpException {
	constructor() {
		super('Friend request not found', 'friend.request.not.found', 404);
	}
}

export { FriendNotFoundException, FriendRequestNotFoundException };
