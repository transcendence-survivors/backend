import { applyDecorators, Type } from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiExtraModels,
	ApiNoContentResponse,
	ApiOkResponse,
	getSchemaPath,
} from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../dto/api-success-response.dto';

export const ApiSuccessResponse = <TModel extends Type>(
	model: TModel,
	options?: { isArray?: boolean; description?: string },
) => {
	return applyDecorators(
		ApiExtraModels(ApiSuccessResponseDto, model),
		ApiOkResponse({
			description: options?.description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ApiSuccessResponseDto) },
					{
						properties: {
							data: options?.isArray
								? {
										type: 'array',
										items: { $ref: getSchemaPath(model) },
									}
								: { $ref: getSchemaPath(model) },
						},
					},
				],
			},
		}),
	);
};

export const ApiCreatedSuccessResponse = <TModel extends Type>(
	model: TModel,
	options?: {
		isArray?: boolean;
		description?: string;
	},
) => {
	return applyDecorators(
		ApiExtraModels(ApiSuccessResponseDto, model),
		ApiCreatedResponse({
			description: options?.description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ApiSuccessResponseDto) },
					{
						properties: {
							data: options?.isArray
								? {
										type: 'array',
										items: { $ref: getSchemaPath(model) },
									}
								: { $ref: getSchemaPath(model) },
						},
					},
				],
			},
		}),
	);
};

export const ApiNoContentSuccessResponse = (options?: {
	description?: string;
}) =>
	applyDecorators(
		ApiNoContentResponse({
			description: options?.description ?? 'No content',
		}),
	);
