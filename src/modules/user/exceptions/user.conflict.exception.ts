import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class UserUsernameConflictException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Username already in use',
			messageKey: 'user_username_already_in_use',
			errors: null,
		};
	}

	constructor() {
		const { message, messageKey, status } =
			UserUsernameConflictException.describe();
		super(message, messageKey, status);
	}
}

export class UserEmailConflictException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Email already registered',
			messageKey: 'user_email_already_in_use',
			errors: null,
		};
	}

	constructor() {
		const { message, messageKey, status } =
			UserEmailConflictException.describe();
		super(message, messageKey, status);
	}
}
