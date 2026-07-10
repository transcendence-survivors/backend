import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatRoomNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Chat room not found.',
			messageKey: 'chat_room_not_found',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			ChatRoomNotFoundException.describe();
		super(message, messageKey, status);
	}
}
