import { HttpException, HttpStatus } from '@nestjs/common';

class FindParamException extends HttpException {
	constructor() {
		super(
			'At least one parameter must be provided',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export default FindParamException;
