import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class TokenNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: 'Refresh Token not found',
			messageKey: 'auth_refresh_token_not_found',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			TokenNotFoundException.describe();
		super(message, messageKey, status);
	}
}
