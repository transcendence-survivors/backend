import { Catch, ExceptionFilter } from '@nestjs/common';
import { mapExceptionToErrorBody } from '../utils/exceptions.utils';
import { ApiError } from '../types/response.type';

@Catch()
export class WsExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown): ApiError {
		return mapExceptionToErrorBody(exception);
	}
}
