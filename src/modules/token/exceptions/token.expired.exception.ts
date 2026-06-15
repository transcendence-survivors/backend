import { HttpException, HttpStatus } from '@nestjs/common';

class TokenExpiredException extends HttpException {
	constructor() {
		super('Token expired', HttpStatus.UNAUTHORIZED);
	}
}

export default TokenExpiredException;
