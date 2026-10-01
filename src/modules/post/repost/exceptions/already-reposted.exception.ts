import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class AlreadyRepostedException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Post already reposted',
			messageKey: 'already_reposted',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			AlreadyRepostedException.describe();
		super(message, messageKey, status);
	}
}

export { AlreadyRepostedException };
