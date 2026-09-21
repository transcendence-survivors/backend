import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class ChatMemberNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Target user is not a member of this chat room.',
			messageKey: 'chat_member_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatMemberNotFoundException.describe();
		super(message, messageKey, status);
	}
}
