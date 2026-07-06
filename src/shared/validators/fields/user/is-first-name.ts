import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsFirstName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};
