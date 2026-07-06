import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class TokenRevokedException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: 'Refresh Token revoked',
			messageKey: 'auth_refresh_token_revoked',
		};
	}

	constructor() {
		const { status, message, messageKey } =
			TokenRevokedException.describe();
		super(message, messageKey, status);
	}
}
