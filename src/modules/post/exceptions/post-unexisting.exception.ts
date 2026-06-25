import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class PostUnexistingException extends AppHttpException {
	constructor() {
		super(
			"Post doesn't belong to you",
			'post ownership',
			HttpStatus.NOT_FOUND,
		);
	}
}

export { PostUnexistingException };
