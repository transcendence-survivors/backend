import {
	IsDisplayName,
	IsEmail,
	IsFirstName,
	IsLastName,
	IsPassword,
	IsUsername,
} from '../user.fields';

class CreateUserDto {
	@IsEmail()
	email!: string;

	@IsUsername()
	username!: string;

	@IsDisplayName()
	displayName!: string;

	@IsFirstName()
	firstName!: string;

	@IsLastName()
	lastName!: string;

	@IsPassword()
	password!: string;
}

export default CreateUserDto;
