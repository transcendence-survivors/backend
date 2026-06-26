import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class SelfUnblockBadException extends AppHttpException {
	constructor() {
		super(
			'You cannot unblock yourself.',
			'bad_unblock_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

class SelfBlockBadException extends AppHttpException {
	constructor() {
		super(
			'You cannot block yourself.',
			'bad_block_request',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export { SelfUnblockBadException, SelfBlockBadException };
