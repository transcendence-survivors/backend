import { ApiError } from '@/shared/types/response.type';
import {
	ExceptionFilter,
	ArgumentsHost,
	Catch,
	HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerFilter implements ExceptionFilter {
	catch(exception: ThrottlerException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const errorBody = {
			status: 'error',
			messageKey: 'too_many_requests',
			message: 'Too many requests',
			errors: null,
			code: HttpStatus.TOO_MANY_REQUESTS,
		} satisfies ApiError;
		response.status(errorBody.code).json(errorBody);
	}
}
