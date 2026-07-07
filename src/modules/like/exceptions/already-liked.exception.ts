import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class AlreadyLikedException extends AppHttpException {
	constructor() {
		super('Post already liked', 'already_liked', HttpStatus.CONFLICT);
	}
}

export { AlreadyLikedException };
