import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class UserConflictException extends AppHttpException {
	constructor(message: string, messageKey: string) {
		super(message, messageKey, HttpStatus.CONFLICT);
	}
}

class UserEmailConflictException extends UserConflictException {
	constructor() {
		super('Email already in use', 'email_already_in_use');
	}
}

class UserUsernameConflictException extends UserConflictException {
	constructor() {
		super('Username already in use', 'username_already_in_use');
	}
}

export { UserEmailConflictException, UserUsernameConflictException };
