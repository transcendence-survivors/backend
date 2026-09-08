import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class SelfChatDmException extends AppHttpException {
	static describe(): ApiErrorDescription {
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

export class ChatRoomDirectImmutableException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'Direct chat rooms cannot be modified.',
			messageKey: 'chat_room_direct_immutable',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatRoomDirectImmutableException.describe();
		super(message, messageKey, status);
	}
}

export class ChatRoomUpdateEmptyException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message:
				'At least one field (name or avatarUrl) must be provided to update.',
			messageKey: 'chat_room_update_empty',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatRoomUpdateEmptyException.describe();
		super(message, messageKey, status);
	}
}
