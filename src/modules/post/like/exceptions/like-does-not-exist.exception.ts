import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class LikeDoesNotExistException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Like does not exist',
			messageKey: 'like_does_not_exist',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			LikeDoesNotExistException.describe();
		super(message, messageKey, status);
	}
}

export { LikeDoesNotExistException };
