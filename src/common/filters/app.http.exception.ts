import { HttpException, HttpStatus } from '@nestjs/common';

class AppHttpException extends HttpException {
	private readonly key: string;

	constructor(message: string, messageKey: string, statusCode: HttpStatus) {
		super(message, statusCode);
		this.key = messageKey;
	}

	get messageKey() {
		return this.key;
	}
}

export { AppHttpException };
