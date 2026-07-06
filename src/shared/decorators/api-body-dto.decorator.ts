import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const ApiBodyDto = <TModel extends Type>(
	model: TModel,
	options?: { isArray?: boolean; description?: string },
) =>
	applyDecorators(
		ApiExtraModels(model),
		ApiBody({
			description: options?.description,
			schema: {
				allOf: [
					options?.isArray
						? {
								type: 'array',
								items: { $ref: getSchemaPath(model) },
							}
						: { $ref: getSchemaPath(model) },
				],
			},
		}),
	);
