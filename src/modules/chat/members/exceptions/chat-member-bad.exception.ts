import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class SelfRoleModificationException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot modify your own role.',
			messageKey: 'chat_member_self_role_modification',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfRoleModificationException.describe();
		super(message, messageKey, status);
	}
}

export class SelfKickException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot kick yourself from the chat room.',
			messageKey: 'chat_member_self_kick',
		};
	}

	constructor() {
		const { message, messageKey, status } = SelfKickException.describe();
		super(message, messageKey, status);
	}
}

export class MemberAlreadyHasRoleException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'User already has the requested role.',
			messageKey: 'chat_member_already_has_role',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			MemberAlreadyHasRoleException.describe();
		super(message, messageKey, status);
	}
}

export class ChatMemberSelfOwnershipException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You are already the owner of this chat room.',
			messageKey: 'chat_member_self_ownership_transfer',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			ChatMemberSelfOwnershipException.describe();
		super(message, messageKey, status);
	}
}
