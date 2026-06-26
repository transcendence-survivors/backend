import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class FriendRequestSelfAcceptException extends AppHttpException {
	constructor() {
		super(
			'You cannot accept your own friend request.',
			'friendship_self_accept',
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}
}

export { FriendRequestSelfAcceptException };
