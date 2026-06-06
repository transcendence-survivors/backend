import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { AppHttpException } from './app.http.exception';
import { Response } from 'express';

type ExceptionString = string;
type ExceptionObject = {
	message?: string;
	errors?: Record<string, unknown>;
};

type ExceptionResponse = ExceptionString | ExceptionObject;

type ErrorResponseBody = {
	status: 'error';
	message: string;
	messageKey?: string;
	code: number;
	errors: Record<string, unknown> | null;
};

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	catch(
		exception: unknown,
		host: ArgumentsHost,
	): Response<unknown, Record<string, unknown>> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (!this.isHttpException(exception)) {
			console.error('Non-HTTP exception:', exception);
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: 'error',
				message: 'Internal server error',
				code: HttpStatus.INTERNAL_SERVER_ERROR,
				errors: null,
			} satisfies ErrorResponseBody);
		}

		const res = exception.getResponse() as ExceptionResponse;
		const code = exception.getStatus();
		return response.status(code).json({
			status: 'error',
			message: this.extractMessage(res),
			messageKey: this.extractMessageKey(exception),
			code,
			errors: this.extractErrors(res),
		} satisfies ErrorResponseBody);
	}

	private extractErrors = (
		response: ExceptionResponse,
	): Record<string, unknown> | null => {
		if (this.isExceptionResponseObject(response)) {
			return response.errors ?? null;
		}
		return null;
	};

	private extractMessage = (response: ExceptionResponse): string => {
		if (typeof response === 'string') {
			return response;
		}
		if (this.isExceptionResponseObject(response)) {
			return response.message ?? 'An error occurred';
		}
		return 'An error occurred';
	};

	private extractMessageKey = (exception: unknown): string | undefined => {
		if (this.isCustomHttpException(exception)) {
			return exception.messageKey;
		}
		return undefined;
	};

	private isHttpException = (
		exception: unknown,
	): exception is HttpException => {
		return exception instanceof HttpException;
	};

	private isCustomHttpException = (
		exception: unknown,
	): exception is AppHttpException => {
		return exception instanceof AppHttpException;
	};

	private isExceptionResponseObject = (
		value: unknown,
	): value is Exclude<ExceptionResponse, string> => {
		return typeof value === 'object' && value !== null;
	};
}
