import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsInt,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator';

const IsCursorLimit = ({
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

const IsCursor = () => {
	return applyDecorators(IsOptional(), IsString(), MaxLength(100));
};

const IsSearch = ({ max = 100 }: { max?: number }) => {
	return applyDecorators(
		IsOptional(),
		IsString(),
		MaxLength(max),
		ApiPropertyOptional({ maxLength: max }),
	);
};

export { IsCursorLimit, IsCursor, IsSearch };
