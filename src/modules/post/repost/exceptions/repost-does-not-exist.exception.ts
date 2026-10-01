import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class RepostDoesNotExistException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Repost does not exist',
			messageKey: 'repost_does_not_exist',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			RepostDoesNotExistException.describe();
		super(message, messageKey, status);
	}
}

export { RepostDoesNotExistException };
