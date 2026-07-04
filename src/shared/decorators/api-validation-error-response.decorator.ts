import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from './api-error-response.decorator';

export const ApiValidationErrorResponse = () =>
	ApiErrorResponse({
		status: HttpStatus.BAD_REQUEST,
		message: 'Validation failed',
		messageKey: 'validation_failed',
		errors: { email: ['email must be a valid email'] },
	});
