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

export class AuthRefreshException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: 'Refresh token is invalid or expired',
			messageKey: 'auth_refresh_token_invalid',
		};
	}

	constructor() {
		const { message, messageKey, status } = AuthRefreshException.describe();
		super(message, messageKey, status);
	}
}

export class AuthUserNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: 'User account not found or has been deactivated',
			messageKey: 'auth_user_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AuthUserNotFoundException.describe();
		super(message, messageKey, status);
	}
}
