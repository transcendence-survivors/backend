import { LocalePreference, UserGender } from '@prisma-generated/enums';

export type UserSettingsPatchParams = {
	gender?: UserGender;
	firstName?: string;
	lastName?: string;
	birthDate?: Date;
	displayName?: string;
	bio?: string | null;
	localePreference?: LocalePreference;
	avatarUrl?: string | null;
	coverImageUrl?: string | null;
};
