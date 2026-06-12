import { UserGender } from '@prisma-generated/client';
import {
	IsBio,
	IsBirthDate,
	IsDisplayName,
	IsEmail,
	IsFirstName,
	IsGender,
	IsLastName,
	IsPassword,
	IsUsername,
} from '../user.decorators';

class CreateUserDto {
	@IsEmail()
	public readonly email!: string;
	@IsUsername()
	public readonly username!: string;

	@IsGender()
	public readonly gender!: UserGender;
	@IsFirstName()
	public readonly firstName!: string;
	@IsLastName()
	public readonly lastName!: string;
	@IsBirthDate()
	public readonly dateOfBirth!: Date;

	@IsDisplayName()
	public readonly displayName!: string;
	@IsBio()
	public readonly bio!: string;

	@IsPassword()
	public readonly password!: string;
}

export default CreateUserDto;
