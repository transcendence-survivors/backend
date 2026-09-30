import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class GameInvalidPlayersCountException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'All players submitted must have a valid user ID',
			messageKey: 'game_invalid_players_count',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			GameInvalidPlayersCountException.describe();
		super(message, messageKey, status);
	}
}

export class GameUserNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'One or more user IDs provided do not exist',
			messageKey: 'game_user_not_found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			GameUserNotFoundException.describe();
		super(message, messageKey, status);
	}
}
