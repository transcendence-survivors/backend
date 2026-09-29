import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'User not found',
			messageKey: 'user_not_found',
			errors: null,
		};
	}

	constructor() {
		const { message, messageKey, status } =
			UserNotFoundException.describe();
		super(message, messageKey, status);
	}
}
