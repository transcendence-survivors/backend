import { User } from '@prisma-generated/browser';

export type UserSettingsRecord = Pick<
	User,
	| 'id'
	| 'username'
	| 'email'
	| 'gender'
	| 'firstName'
	| 'lastName'
	| 'birthDate'
	| 'displayName'
	| 'bio'
	| 'avatarUrl'
	| 'coverImageUrl'
	| 'localePreference'
	| 'createdAt'
>;
