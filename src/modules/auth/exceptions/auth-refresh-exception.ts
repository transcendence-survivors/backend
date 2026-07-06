import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

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
