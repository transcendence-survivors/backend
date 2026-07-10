import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatUserNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'One or more invited users do not exist.',
			messageKey: 'chat_room_user_not_found',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			ChatUserNotFoundException.describe();
		super(message, messageKey, status);
	}
}
