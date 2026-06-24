import { IsAtLeast13Constraint } from '@/shared/validators/isAtLeast13';
import { applyDecorators } from '@nestjs/common';
import { LocalePreference, UserGender } from '@prisma-generated/enums';
import { Type } from 'class-transformer';

import {
	IsEmail as IsEmailValidator,
	IsString,
	MaxLength,
	MinLength,
	Matches,
	IsDate,
	Validate,
	IsEnum,
	IsStrongPassword,
} from 'class-validator';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const IsEmail = () => {
	return applyDecorators(IsEmailValidator(), MaxLength(255), MinLength(5));
};
export const IsUsername = () => {
	return applyDecorators(
		IsString(),
		MinLength(1),
		MaxLength(25),
		Matches(USERNAME_REGEX),
	);
};

export const IsFirstName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};
export const IsLastName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};
export const IsBirthDate = () => {
	return applyDecorators(
		Type(() => Date),
		IsDate(),
		Validate(IsAtLeast13Constraint),
	);
};
export const IsGender = () => {
	return applyDecorators(IsEnum(UserGender));
};

export const IsDisplayName = () => {
	return applyDecorators(IsString(), MinLength(1), MaxLength(25));
};

export const IsBio = () => {
	return applyDecorators(IsString(), MaxLength(255), MinLength(0));
};

export const IsPassword = () => {
	return applyDecorators(
		IsStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		}),
	);
};

export const IsLocalePreference = () => {
	return applyDecorators(IsEnum(LocalePreference));
};
