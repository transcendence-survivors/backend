import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionResponse =
	| string
	| {
			message?: string | string[];
			error?: string;
			errors?: Record<string, unknown>;
	  };

type ErrorResponseBody = {
	status: 'error';
	message: string | string[];
	code: number;
	errors: Record<string, unknown> | null;
	timestamp: string;
	path: string;
};

const isExceptionResponseObject = (
	value: unknown,
): value is Exclude<ExceptionResponse, string> => {
	return typeof value === 'object' && value !== null;
};

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: string | string[] = 'Internal server error';
		let errors: Record<string, unknown> | null = null;

		if (exception instanceof HttpException) {
			status = exception.getStatus();

			const res = exception.getResponse() as ExceptionResponse;

			if (typeof res === 'string') {
				message = res;
			} else if (isExceptionResponseObject(res)) {
				message = res.message ?? exception.message;
				errors = res.errors ?? null;
			} else {
				message = exception.message;
			}
		} else {
			console.error('Unexpected exception:', exception);
		}

		const body: ErrorResponseBody = {
			status: 'error',
			message,
			code: status,
			errors,
			timestamp: new Date().toISOString(),
			path: request.url,
		};

		response.status(status).json(body);
	}
}
