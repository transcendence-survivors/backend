import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';

export const ApiQueryDto = <TModel extends Type>(model: TModel) =>
	applyDecorators(
		ApiExtraModels(model),
		ApiQuery({
			type: model,
		}),
	);
