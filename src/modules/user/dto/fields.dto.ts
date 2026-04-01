import { PartialType } from '@nestjs/mapped-types';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

const ERR = {
	EMPTY: 'ERR_EMPTY',
	MIN_LENGTH: 'ERR_MIN_LENGTH',
	MAX_LENGTH: 'ERR_MAX_LENGTH',
	IS_STRING: 'ERR_IS_STRING',
	IS_EMAIL: 'ERR_EMAIL',
	IS_DEFINED: 'ERR_UNDEFINED',
};

export class PasswordDto {
	@IsNotEmpty({ message: ERR.EMPTY })
	@IsString({ message: ERR.IS_STRING })
	@MinLength(6, { message: ERR.MIN_LENGTH })
	@MaxLength(100, { message: ERR.MAX_LENGTH })
	password: string;
}
export class OptionalPasswordDto extends PartialType(PasswordDto) {}

export class EmailDto {
	@IsEmail({}, { message: ERR.IS_EMAIL })
	email: string;
}
export class OptionalEmailDto extends PartialType(EmailDto) {}

export class UsernameDto {
	@IsNotEmpty()
	@IsString({ message: ERR.IS_STRING })
	@MinLength(3, { message: ERR.MIN_LENGTH })
	@MaxLength(20, { message: ERR.MAX_LENGTH })
	username: string;
}
export class OptionalUsernameDto extends PartialType(UsernameDto) {}

export class NameDto {
	@IsNotEmpty()
	@IsString({ message: ERR.IS_STRING })
	@MinLength(3, { message: ERR.MIN_LENGTH })
	@MaxLength(50, { message: ERR.MAX_LENGTH })
	name: string;
}
export class OptionalNameDto extends PartialType(NameDto) {}
