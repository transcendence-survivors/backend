import { HttpException, HttpStatus } from '@nestjs/common';

class TokenNotFoundException extends HttpException {
	constructor() {
		super('Token not found', HttpStatus.NOT_FOUND);
	}
}

export default TokenNotFoundException;
