import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class SelfChatDmException extends AppHttpException {
	static describe() {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot create a direct chat with yourself.',
			messageKey: 'chat_room_self_chat_dm',
		};
	}

	constructor() {
		const { status, message, messageKey } = SelfChatDmException.describe();
		super(message, messageKey, status);
	}
}
