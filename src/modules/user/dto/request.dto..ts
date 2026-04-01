import { IntersectionType } from '@nestjs/mapped-types';
import {
	EmailDto,
	PasswordDto,
	NameDto,
	UsernameDto,
	OptionalUsernameDto,
	OptionalNameDto,
	OptionalEmailDto,
	FirstNameDto,
	LastNameDto,
} from './fields.dto';

export class CreateUserDto extends IntersectionType(
	EmailDto,
	PasswordDto,
	NameDto,
	UsernameDto,
	FirstNameDto,
	LastNameDto,
) {}

export class UpdateUserDto extends IntersectionType(
	OptionalEmailDto,
	OptionalNameDto,
	OptionalUsernameDto,
	PasswordDto,
) {}
