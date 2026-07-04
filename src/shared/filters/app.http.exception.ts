import { HttpException, HttpStatus } from '@nestjs/common';

export type ApiErrorDescription = {
	status: HttpStatus;
	message: string;
	messageKey: string;
	errors?: Record<string, unknown> | null;
};

export abstract class AppHttpException extends HttpException {
	public readonly message: string;
	public readonly messageKey: string;

	constructor(message: string, messageKey: string, status: HttpStatus) {
		super({ message, messageKey, status }, status);
		this.message = message;
		this.messageKey = messageKey;
	}

	static describe(): ApiErrorDescription {
		throw new Error(
			`${this.name} must implement a static describe() method`,
		);
	}
}
