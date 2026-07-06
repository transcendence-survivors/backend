import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';
import {
	ApiErrorDescription,
	AppHttpException,
} from '../filters/app.http.exception';

export const ApiErrorResponse = (description: ApiErrorDescription) =>
	applyDecorators(
		ApiExtraModels(ApiErrorResponseDto),
		ApiResponse({
			status: description.status,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ApiErrorResponseDto) },
					{
						example: {
							status: 'error',
							code: description.status,
							message: description.message,
							messageKey: description.messageKey,
							errors: description.errors ?? null,
						},
					},
				],
			},
		}),
	);

export const ApiGroupedErrorResponse = (
	exceptions: Array<typeof AppHttpException>,
) => {
	const schemas = exceptions.map((e) => e.describe());

	return applyDecorators(
		ApiExtraModels(ApiErrorResponseDto),
		ApiResponse({
			status: schemas[0].status,
			schema: {
				oneOf: schemas.map((s) => ({
					allOf: [
						{ $ref: getSchemaPath(ApiErrorResponseDto) },
						{
							example: {
								status: 'error',
								code: s.status,
								message: s.message,
								messageKey: s.messageKey,
								errors: s.errors ?? null,
							},
						},
					],
				})),
			},
		}),
	);
};

export const ApiErrorFrom = (exceptionCtor: typeof AppHttpException) =>
	ApiErrorResponse(exceptionCtor.describe());
