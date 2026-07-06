import { applyDecorators } from '@nestjs/common';
import { UserGender } from '@prisma-generated/enums';
import { IsEnum } from 'class-validator';

export const IsGender = () => {
	return applyDecorators(IsEnum(UserGender));
};
