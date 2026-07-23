import { LocalePreference } from '@prisma-generated/enums';

export class PasswordResetRequestedEvent {
	constructor(
		public readonly email: string,
		public readonly token: string,
		public readonly locale: LocalePreference,
	) {}
}
