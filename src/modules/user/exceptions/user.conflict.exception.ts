import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class UserEmailConflictException extends AppHttpException {
	constructor() {
		super(
			'Email already in use',
			'user_email_already_in_use',
			HttpStatus.CONFLICT,
		);
	}
}

class UserUsernameConflictException extends AppHttpException {
	constructor() {
		super(
			'Username already in use',
			'user_username_already_in_use',
			HttpStatus.CONFLICT,
		);
	}
}

export { UserEmailConflictException, UserUsernameConflictException };
