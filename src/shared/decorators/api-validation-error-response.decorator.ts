import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from './api-error-response.decorator';

export const ApiValidationErrorResponse = (errors?: Record<string, string[]>) =>
	ApiErrorResponse({
		status: HttpStatus.BAD_REQUEST,
		message: 'Validation failed',
		messageKey: 'validation_failed',
		errors: errors ?? {
			key: ['Validation error'],
		},
	});
