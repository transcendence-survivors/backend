import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { AuthProviderType } from '@prisma-generated/enums';
import type { AuthProviderSelect } from '@prisma-generated/models';
import { AuthProviderQueryHelper } from './auth-provider-query.helper';
import { AuthProviderCreateLocaleParams } from '../types/params/auth-provider-create-locale.params';
import { AuthProviderUpdateLocalePasswordParams } from '../types/params/auth-provider-update-locale-password.params';
import { AuthProviderLocaleCreated } from '../types/records/auth-provider-locale-created.type';
import { AuthProviderLocaleWithPassword } from '../types/records/auth-provider-locale-with-password.type';
import { AuthProviderId } from '../types/records/auth-provider-id.type';

@Injectable()
export class AuthProviderRepository {
	private static readonly selectLocale = {
		userId: true,
	} satisfies Record<'userId', AuthProviderSelect['userId']>;

	constructor(private readonly prisma: PrismaService) {}

	createLocale(
		{ hash, userId }: AuthProviderCreateLocaleParams,
		ctx?: DbContext,
	): Promise<AuthProviderLocaleCreated> {
		return (ctx?.client ?? this.prisma).authProvider.create({
			data: {
				provider: AuthProviderType.LOCAL,
				password: hash,
				userId: userId,
			},
			select: {
				user: {
					select: AuthProviderQueryHelper.userSelect,
				},
			} satisfies Record<
				keyof AuthProviderLocaleCreated,
				AuthProviderSelect[keyof AuthProviderLocaleCreated]
			>,
		});
	}

	findLocaleByUsernameOrEmail(
		usernameOrEmail: string,
		ctx?: DbContext,
	): Promise<AuthProviderLocaleWithPassword | null> {
		return (ctx?.client ?? this.prisma).authProvider.findFirst({
			where: AuthProviderQueryHelper.localeByUsernameOrEmailWhere(
				usernameOrEmail,
			),
			select: {
				...AuthProviderRepository.selectLocale,
				password: true,
				user: {
					select: AuthProviderQueryHelper.userSelect,
				},
			} satisfies Record<
				keyof AuthProviderLocaleWithPassword,
				AuthProviderSelect[keyof AuthProviderLocaleWithPassword]
			>,
		});
	}

	updateLocalePassword(
		{ userId, newPasswordHash }: AuthProviderUpdateLocalePasswordParams,
		ctx?: DbContext,
	): Promise<AuthProviderId> {
		return (ctx?.client ?? this.prisma).authProvider.update({
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
			} satisfies Record<
				keyof AuthProviderId,
				AuthProviderSelect[keyof AuthProviderId]
			>,
		});
	}
}
