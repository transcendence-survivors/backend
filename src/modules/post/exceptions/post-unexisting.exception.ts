import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class PostDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			"Post doesn't exist",
			'post_does_not_exist',
			HttpStatus.NOT_FOUND,
		);
	}
}

export { PostDoesNotExistException };
