import { IntersectionType } from '@nestjs/mapped-types';
import {
	EmailDto,
	PasswordDto,
	NameDto,
	UsernameDto,
	OptionalUsernameDto,
	OptionalNameDto,
	OptionalEmailDto,
} from './fields.dto';

export class CreateUserDto extends IntersectionType(
	EmailDto,
	PasswordDto,
	NameDto,
	UsernameDto,
) {}

export class UpdateUserDto extends IntersectionType(
	OptionalEmailDto,
	OptionalNameDto,
	OptionalUsernameDto,
	PasswordDto,
) {}
