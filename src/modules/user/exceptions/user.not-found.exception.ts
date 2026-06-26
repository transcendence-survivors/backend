import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class UserDoesNotExistException extends AppHttpException {
	constructor() {
		super(
			'User does not exist',
			'user_does_not_exist',
			HttpStatus.NOT_FOUND,
		);
	}
}

export default UserDoesNotExistException;
