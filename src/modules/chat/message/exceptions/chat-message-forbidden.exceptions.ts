import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatMessageActionForbiddenException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'You are not allowed to perform this action on this message',
			messageKey: 'chat_message_action_forbidden',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatMessageActionForbiddenException.describe();
		super(message, messageKey, status);
	}
}
