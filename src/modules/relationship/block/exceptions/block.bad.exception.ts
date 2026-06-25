import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class BadBlockException extends AppHttpException {
	constructor() {
		super(
			'You cannot block yourself.',
			'bad_block_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export { BadBlockException };
