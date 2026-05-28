import { HttpException, HttpStatus } from '@nestjs/common';

class UserConflictException extends HttpException {
	constructor(message: string) {
		super(message, HttpStatus.CONFLICT);
	}
}

class UserEmailConflictException extends UserConflictException {
	constructor() {
		super('Email already in use');
	}
}

class UserUsernameConflictException extends UserConflictException {
	constructor() {
		super('Username already in use');
	}
}

export { UserEmailConflictException, UserUsernameConflictException };
