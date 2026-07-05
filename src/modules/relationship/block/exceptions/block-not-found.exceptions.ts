import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

export class BlockNotFoundException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'Block not found',
			messageKey: 'block.not.found',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			BlockNotFoundException.describe();
		super(message, messageKey, status);
	}
}
