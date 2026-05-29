import {
	IsPassword,
	IsUsername,
	type UserPassword,
	type UserUsername,
} from '../user.fields';

export class SignInDto {
	@IsUsername()
	username!: UserUsername;

	@IsPassword()
	password!: UserPassword;
}

export default SignInDto;
