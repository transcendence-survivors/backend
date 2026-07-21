import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatMessageNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Chat message not found',
			messageKey: 'chat_message_notFound',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatMessageNotFoundException.describe();
		super(message, messageKey, status);
	}
}
