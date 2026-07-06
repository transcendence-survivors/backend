import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthLoginException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message:
				'Invalid credentials provided. Please check your username/email and password.',
			messageKey: 'auth_credentials',
		};
	}

	constructor() {
		const { message, messageKey, status } = AuthLoginException.describe();
		super(message, messageKey, status);
	}
}
