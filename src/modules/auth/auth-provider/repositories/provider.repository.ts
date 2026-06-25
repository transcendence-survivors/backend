import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { type AuthProvider, type User } from '@prisma-generated/client';
import { AuthProviderType } from '@prisma-generated/enums';

@Injectable()
export class AuthProviderRepository {
	constructor(private readonly prisma: PrismaService) {}

	private readonly selectLocale = {
		userId: true,
	} as const satisfies Partial<Record<keyof AuthProvider, boolean>>;

	private readonly selectUser = {
		id: true,
		email: true,
		username: true,
		role: true,
		displayName: true,
	} as const satisfies Partial<Record<keyof User, boolean>>;

	createLocale(hash: string, userId: string, ctx?: DbContext) {
		return (ctx?.client || this.prisma).authProvider.create({
			data: {
				provider: AuthProviderType.LOCAL,
				password: hash,
				userId: userId,
			},
			select: {
				...this.selectLocale,
				user: {
					select: {
						...this.selectUser,
					},
				},
			},
		});
	}

	findLocaleByUsernameOrEmail(usernameOrEmail: string, ctx?: DbContext) {
		return (ctx?.client || this.prisma).authProvider.findFirst({
			where: {
				provider: AuthProviderType.LOCAL,
				OR: [
					{ user: { email: usernameOrEmail } },
					{ user: { username: usernameOrEmail } },
				],
			},
			select: {
				...this.selectLocale,
				password: true,
				user: {
					select: {
						...this.selectUser,
					},
				},
			},
		});
	}

	updateLocalePassword(
		userId: string,
		newPasswordHash: string,
		ctx?: DbContext,
	) {
		return (ctx?.client || this.prisma).authProvider.update({
			where: {
				userId_provider: {
					userId,
					provider: AuthProviderType.LOCAL,
				},
			},
			data: {
				password: newPasswordHash,
			},
			select: {
				id: true,
			},
		});
	}
}
