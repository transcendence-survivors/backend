import { applyDecorators } from '@nestjs/common';
import { LocalePreference } from '@prisma-generated/enums';
import { IsEnum } from 'class-validator';

export const IsLocalePreference = () => {
	return applyDecorators(IsEnum(LocalePreference));
};
