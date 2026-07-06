import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export const IsUsername = () =>
	applyDecorators(
		IsString(),
		MinLength(1),
		MaxLength(25),
		Matches(/^[a-zA-Z0-9_]+$/),
	);
