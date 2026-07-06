import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: 'Refresh Token expired',
			messageKey: 'auth_refresh_token_expired',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			TokenExpiredException.describe();
		super(message, messageKey, status);
	}
}
