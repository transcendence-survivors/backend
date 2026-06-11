import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	usernameOrEmail!: string;

	@IsString()
	@MinLength(1)
	@MaxLength(255)
	password!: string;
}

export default SignInDto;
