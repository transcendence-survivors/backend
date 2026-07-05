import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class BlockConflictException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.CONFLICT,
			message: 'Block already exists',
			messageKey: 'block.conflict',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			BlockConflictException.describe();
		super(message, messageKey, status);
	}
}
