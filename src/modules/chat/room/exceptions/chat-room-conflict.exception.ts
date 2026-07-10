import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatRoomDmConflictException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Direct chat already exists with this user.',
			messageKey: 'chat_room_dm_conflict',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			ChatRoomDmConflictException.describe();
		super(message, messageKey, status);
	}
}
