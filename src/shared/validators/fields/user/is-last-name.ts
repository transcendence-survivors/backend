import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsLastName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};
