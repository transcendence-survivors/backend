import { Email } from '@/libs/types';
import { applyDecorators } from '@nestjs/common';
import {
	IsEmail as IsEmailValidator,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
	Matches,
} from 'class-validator';

const ERR = {
	EMPTY: 'ERR_EMPTY',
	MIN_LENGTH: 'ERR_MIN_LENGTH',
	MAX_LENGTH: 'ERR_MAX_LENGTH',
	IS_STRING: 'ERR_IS_STRING',
	IS_EMAIL: 'ERR_EMAIL',
	IS_DEFINED: 'ERR_UNDEFINED',
	INVALID_USERNAME: 'ERR_INVALID_USERNAME',
} as const;

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export type UserPassword = string;
export const IsPassword = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsString({ message: ERR.IS_STRING }),
		MinLength(6, { message: ERR.MIN_LENGTH }),
		MaxLength(100, { message: ERR.MAX_LENGTH }),
	);

export type UserEmail = Email;
export const IsEmail = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsEmailValidator({}, { message: ERR.IS_EMAIL }),
		MaxLength(255, { message: ERR.MAX_LENGTH }),
		MinLength(5, { message: ERR.MIN_LENGTH }),
	);

export type UserUsername = string;
export const IsUsername = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsString({ message: ERR.IS_STRING }),
		MinLength(3, { message: ERR.MIN_LENGTH }),
		MaxLength(20, { message: ERR.MAX_LENGTH }),
		Matches(USERNAME_REGEX, { message: ERR.INVALID_USERNAME }),
	);

export type UserDisplayName = string;
export const IsDisplayName = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsString({ message: ERR.IS_STRING }),
		MinLength(3, { message: ERR.MIN_LENGTH }),
		MaxLength(50, { message: ERR.MAX_LENGTH }),
	);

export type UserFirstName = string;
export const IsFirstName = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsString({ message: ERR.IS_STRING }),
		MinLength(3, { message: ERR.MIN_LENGTH }),
		MaxLength(50, { message: ERR.MAX_LENGTH }),
	);

export type UserLastName = string;
export const IsLastName = () =>
	applyDecorators(
		IsNotEmpty({ message: ERR.EMPTY }),
		IsString({ message: ERR.IS_STRING }),
		MaxLength(50, { message: ERR.MAX_LENGTH }),
		MinLength(3, { message: ERR.MIN_LENGTH }),
	);
