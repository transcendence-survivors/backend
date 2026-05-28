import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
	constructor() {
		super({
			whitelist: true,
			transform: true,
			stopAtFirstError: true,
			exceptionFactory: (errors: ValidationError[]) => {
				return new BadRequestException({
					message: 'Validation failed',
					errors: this.formatValidationErrors(errors),
				});
			},
		});
	}

	private formatValidationErrors(
		errors: ValidationError[],
	): Record<string, string[]> {
		const result: Record<string, string[]> = {};

		for (const error of errors) {
			if (error.constraints) {
				result[error.property] = Object.values(error.constraints);
			}

			if (error.children?.length) {
				const childErrors = this.formatValidationErrors(error.children);

				for (const key in childErrors) {
					result[key] = childErrors[key];
				}
			}
		}

		return result;
	}
}
