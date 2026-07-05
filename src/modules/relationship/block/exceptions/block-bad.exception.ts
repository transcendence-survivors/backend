import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class SelfUnblockBadException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot unblock yourself.',
			messageKey: 'bad_unblock_request',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfUnblockBadException.describe();
		super(message, messageKey, status);
	}
}

export class SelfBlockBadException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'You cannot block yourself.',
			messageKey: 'bad_block_request',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			SelfBlockBadException.describe();
		super(message, messageKey, status);
	}
}
