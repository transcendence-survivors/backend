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

export class GameStatsNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Game stats details were not found',
			messageKey: 'game_stats_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			GameStatsNotFoundException.describe();
		super(message, messageKey, status);
	}
}
