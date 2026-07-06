import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthProviderCredentialsException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message:
				'Invalid credentials provided. Please check your username/email and password.',
			messageKey: 'auth_credentials',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AuthProviderCredentialsException.describe();
		super(message, messageKey, status);
	}
}
