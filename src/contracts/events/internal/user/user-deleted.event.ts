import { LocalePreference } from '@prisma-generated/enums';

export class UserDeletedEvent {
	constructor(
		public readonly email: string,
		public readonly username: string,
		public readonly locale: LocalePreference,
	) {}
}
