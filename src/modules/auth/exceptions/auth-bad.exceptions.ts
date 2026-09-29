import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthInvalidCurrentPasswordException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'Current password provided is incorrect',
			messageKey: 'security_invalid_current_password',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AuthInvalidCurrentPasswordException.describe();
		super(message, messageKey, status);
	}
}

export class AuthSamePasswordException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'New password must be different from current password',
			messageKey: 'security_same_password',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AuthSamePasswordException.describe();
		super(message, messageKey, status);
	}
}
