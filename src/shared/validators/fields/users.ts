import { applyDecorators } from '@nestjs/common';
import {
	IsString,
	MaxLength,
	MinLength,
	IsEmail as IsEmailValidator,
	IsDate,
	Validate,
	IsEnum,
	IsStrongPassword,
	Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsAtLeast13Constraint } from '../isAtLeast13';
import { TrimLowercase } from '@/shared/decorators/trim-dto.decorators';
import { LocalePreference, UserGender } from '@prisma-generated/enums';

export const IsBio = () => {
	return applyDecorators(IsString(), MaxLength(255), MinLength(0));
};

export const IsBirthDate = () => {
	return applyDecorators(
		Type(() => Date),
		IsDate(),
		Validate(IsAtLeast13Constraint),
	);
};

export const IsDisplayName = () => {
	return applyDecorators(IsString(), MinLength(1), MaxLength(25));
};

export const IsEmail = () => {
	return applyDecorators(IsEmailValidator(), MaxLength(254), TrimLowercase());
};

export const IsFirstName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};
export const IsLastName = () => {
	return applyDecorators(IsString(), MinLength(2), MaxLength(50));
};

export const IsGender = () => {
	return applyDecorators(IsEnum(UserGender));
};

export const IsLocalePreference = () => {
	return applyDecorators(IsEnum(LocalePreference));
};

export const IsPassword = () =>
	applyDecorators(
		IsStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		}),
	);

export const IsUsername = () =>
	applyDecorators(
		IsString(),
		MinLength(1),
		MaxLength(25),
		Matches(/^[a-zA-Z0-9_]+$/),
	);
