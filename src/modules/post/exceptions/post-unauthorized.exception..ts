import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class PostOwnershipException extends AppHttpException {
	constructor() {
		super(
			"Post doesn't belong to you",
			'post ownership',
			HttpStatus.UNAUTHORIZED,
		);
	}
}

export { PostOwnershipException };
