import type { ResetPasswordTokenWhereInput } from '@prisma-generated/models';

export class PasswordTokenQueryHelper {
	public static activeTokenWhere(
		tokenHash: string,
	): ResetPasswordTokenWhereInput {
		return {
			tokenHash,
			used: false,
			expiresAt: { gte: new Date() },
		};
	}

	public static expirationDate(expireInMs: number): Date {
		return new Date(Date.now() + expireInMs);
	}
}
