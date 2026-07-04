import {
	IsBio,
	IsBirthDate,
	IsDisplayName,
	IsFirstName,
	IsGender,
	IsLastName,
	IsLocalePreference,
	IsUsername,
	IsEmail,
} from '../../user.decorators';
import { LocalePreference, UserGender } from '@prisma-generated/enums';

class UserCreateDto {
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
	@IsLocalePreference()
	public readonly localePreference!: LocalePreference;

	@IsDisplayName()
	public readonly displayName!: string;
	@IsBio()
	public readonly bio!: string;
}

export default UserCreateDto;
