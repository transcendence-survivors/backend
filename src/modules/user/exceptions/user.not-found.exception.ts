import { HttpException, HttpStatus } from '@nestjs/common';

class UserNotFoundException extends HttpException {
	constructor() {
		super('User not found', HttpStatus.NOT_FOUND);
	}
}

export default UserNotFoundException;
