import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class UserSettingsUpdateEmptyException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message:
				'At least one field  must be provided to update user settings.',
			messageKey: 'user_settings_update_empty',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			UserSettingsUpdateEmptyException.describe();
		super(message, messageKey, status);
	}
}
