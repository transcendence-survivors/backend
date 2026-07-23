import { LocalePreference } from '@prisma-generated/enums';

export class UserCreatedEvent {
	constructor(
		public readonly userId: string,
		public readonly email: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly username: string,
		public readonly locale: LocalePreference,
	) {}
}
