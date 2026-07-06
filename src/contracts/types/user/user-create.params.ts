import { LocalePreference, UserGender } from '@prisma-generated/enums';

export interface UserCreateParams {
	email: string;
	username: string;

	gender: UserGender;
	firstName: string;
	lastName: string;
	birthDate: Date;
	localePreference: LocalePreference;

	displayName: string;
	bio: string;
}
