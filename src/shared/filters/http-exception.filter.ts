import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { mapExceptionToErrorBody } from '../utils/exceptions.utils';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
	catch(
		exception: unknown,
		host: ArgumentsHost,
	): Response<unknown, Record<string, unknown>> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const body = mapExceptionToErrorBody(exception);

		return response.status(body.code).json(body);
	}
}
