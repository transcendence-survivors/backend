import { LocalePreference, UserGender } from '@prisma-generated/enums';

export type UserCreateParams = {
	birthDate: Date;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	bio?: string;
	username: string;
	gender: UserGender;
	localePreference: LocalePreference;
};
