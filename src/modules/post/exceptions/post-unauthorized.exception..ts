import {
	ApiErrorDescription,
	AppHttpException,
} from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class PostOwnershipException extends AppHttpException {
	static describe(): ApiErrorDescription {
		return {
			status: HttpStatus.UNAUTHORIZED,
			message: "Post doesn't belong to you",
			messageKey: 'post_ownership',
		};
	}

	constructor() {
		const { message, messageKey, status } =
			PostOwnershipException.describe();
		super(message, messageKey, status);
	}
}

export { PostOwnershipException };
