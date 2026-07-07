import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class LikeDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			'Like does not exist',
			'like_does_not_exist',
			HttpStatus.NOT_FOUND,
		);
	}
}

export { LikeDoesNotExistException };
