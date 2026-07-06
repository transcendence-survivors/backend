import { UserQueryHelper } from '@/modules/user/user.public-api';
import { AuthProviderType } from '@prisma-generated/enums';
import type { AuthProviderWhereInput } from '@prisma-generated/models';

export class AuthProviderQueryHelper {
	public static localeByUsernameOrEmailWhere(
		usernameOrEmail: string,
	): AuthProviderWhereInput {
		return {
			provider: AuthProviderType.LOCAL,
			OR: [
				{ user: { email: usernameOrEmail } },
				{ user: { username: usernameOrEmail } },
			],
		};
	}

	public static readonly userSelect = {
		...UserQueryHelper.userSelect,
		email: true,
		role: true,
	};
}
