import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class RepostDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			'Repost does not exist',
			'repost_does_not_exist',
			HttpStatus.NOT_FOUND,
		);
	}
}

export { RepostDoesNotExistException };
