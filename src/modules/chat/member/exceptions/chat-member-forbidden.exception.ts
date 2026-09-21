import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class InsufficientMemberPermissionException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message:
				'You do not have sufficient permission to perform this action on this member.',
			messageKey: 'chat_member_insufficient_permission',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			InsufficientMemberPermissionException.describe();
		super(message, messageKey, status);
	}
}

export class ChatMemberNotOwnerException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.FORBIDDEN,
			message: 'Only the room owner can transfer ownership.',
			messageKey: 'chat_member_not_owner',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatMemberNotOwnerException.describe();
		super(message, messageKey, status);
	}
}
