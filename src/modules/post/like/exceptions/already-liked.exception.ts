import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class AlreadyLikedException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Post already liked',
			messageKey: 'already_liked',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AlreadyLikedException.describe();
		super(message, messageKey, status);
	}
}

export { AlreadyLikedException };
