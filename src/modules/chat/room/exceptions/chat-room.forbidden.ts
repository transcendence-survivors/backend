import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatRoomDMUserBlockedByYou extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'You have blocked this user. You cannot create a direct chat with them.',
			messageKey: 'chat_room_dm_user_blocked_by_you',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			ChatRoomDMUserBlockedByYou.describe();
		super(message, messageKey, status);
	}
}

export class ChatRoomDMUserBlockedYou extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'This user has blocked you. You cannot create a direct chat with them.',
			messageKey: 'chat_room_dm_user_blocked_you',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			ChatRoomDMUserBlockedYou.describe();
		super(message, messageKey, status);
	}
}
