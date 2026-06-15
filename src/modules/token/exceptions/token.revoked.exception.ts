import { HttpException, HttpStatus } from '@nestjs/common';

class TokenRevokedException extends HttpException {
	constructor() {
		super('Token revoked', HttpStatus.UNAUTHORIZED);
	}
}

export default TokenRevokedException;
