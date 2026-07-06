import { applyDecorators } from '@nestjs/common';
import { IsDate, Validate } from 'class-validator';
import { IsAtLeast13Constraint } from '../../isAtLeast13';
import { Type } from 'class-transformer';

export const IsBirthDate = () => {
	return applyDecorators(
		Type(() => Date),
		IsDate(),
		Validate(IsAtLeast13Constraint),
	);
};
