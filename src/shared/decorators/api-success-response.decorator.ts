import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
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
