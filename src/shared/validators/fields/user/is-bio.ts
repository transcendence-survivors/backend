import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsBio = () => {
	return applyDecorators(IsString(), MaxLength(255), MinLength(0));
};
