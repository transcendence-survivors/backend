import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const IsPaginationLimit = ({
	min = 1,
	max = 100,
}: {
	min?: number;
	max?: number;
}) => {
	return applyDecorators(
		IsOptional(),
		Type(() => Number),
		IsInt(),
		Min(min),
		Max(max),
	);
};

const IsPaginationPage = () => {
	return applyDecorators(
		IsOptional(),
		Type(() => Number),
		IsInt(),
		Min(1),
	);
};

export { IsPaginationLimit, IsPaginationPage };
