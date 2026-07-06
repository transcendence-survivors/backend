import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsDisplayName = () => {
	return applyDecorators(IsString(), MinLength(1), MaxLength(25));
};
