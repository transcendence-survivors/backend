import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class UserGameSummaryNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'User game summary was not found',
			messageKey: 'user_game_summary_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			UserGameSummaryNotFoundException.describe();
		super(message, messageKey, status);
	}
}
