import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { DbContext } from '@/core/database/uow/db-context';
import { UserQueryHelper } from './user-query.helper';
import type { UsersCountParams } from '../types/params/user-count.params';
import type { UserListItem } from '../types/records/user-list-item.type';
import type { UserProfileRecord } from '../types/records/user-profile.type';
import type { UsersCursorParams } from '../types/params/user-cursor.params';
import type { UserCreated } from '../types/records/user-created.type';
import type { UserLocalePreference } from '../types/records/user-locale-preference.type';
import type { UserEmailUsername } from '../types/records/user-email-username.type';
import type { UserEmailOrUsernameParams } from '../types/params/user-email-or-username.params';
import type { UserSelect } from '@prisma-generated/models';
import type { UserTokenData } from '@/contracts/types/user/user-token-data.type';
import { UserCreateParams } from '@/contracts/types/user/user-create.params';

@Injectable()
export class UserRepository {
	private static readonly select = {
		...UserQueryHelper.userSelect,
	} satisfies Record<keyof UserListItem, UserSelect[keyof UserListItem]>;

	constructor(private readonly prisma: PrismaService) {}

	cursor(
		{ limit, cursor, search, orderBy, userId }: UsersCursorParams,
		ctx?: DbContext,
	): Promise<UserListItem[]> {
		const client = ctx?.client ?? this.prisma;
		return client.user.findMany({
			...UserQueryHelper.pagination(limit, cursor),
			where: {
				...(search && UserQueryHelper.searchWhere(search)),
				...(userId && UserQueryHelper.notBlockedWhere(userId)),
			},
			orderBy: UserQueryHelper.orderBy[orderBy],
			select: {
				...UserRepository.select,
			} satisfies Record<
				keyof UserListItem,
				UserSelect[keyof UserListItem]
			>,
		});
	}

	cursorCount(
		{ search, userId }: UsersCountParams,
		ctx?: DbContext,
	): Promise<number> {
		const client = ctx?.client ?? this.prisma;
		return client.user.count({
			where: {
				...(search && UserQueryHelper.searchWhere(search)),
				...(userId && UserQueryHelper.notBlockedWhere(userId)),
			},
		});
	}

	profileByUsername(username: string): Promise<UserProfileRecord | null> {
		return this.prisma.user.findUnique({
			where: { username },
			select: {
				...UserRepository.select,
				coverImageUrl: true,
				bio: true,
			} satisfies Record<
				keyof UserProfileRecord,
				UserSelect[keyof UserProfileRecord]
			>,
		});
	}

	async delete(id: string, ctx?: DbContext): Promise<void> {
		await (ctx?.client ?? this.prisma).user.delete({ where: { id } });
	}

	findByEmailOrUsername(
		params: UserEmailOrUsernameParams,
		ctx?: DbContext,
	): Promise<UserEmailUsername | null> {
		return (ctx?.client ?? this.prisma).user.findFirst({
			where: {
				OR: [{ email: params.email }, { username: params.username }],
			},
			select: {
				email: true,
				username: true,
			} satisfies Record<
				keyof UserEmailUsername,
				UserSelect[keyof UserEmailUsername]
			>,
		});
	}

	save(data: UserCreateParams, ctx?: DbContext): Promise<UserCreated> {
		return (ctx?.client ?? this.prisma).user.create({
			data: {
				birthDate: data.birthDate,
				email: data.email,
				firstName: data.firstName,
				displayName: data.displayName,
				bio: data.bio,
				lastName: data.lastName,
				username: data.username,
				gender: data.gender,
				localePreference: data.localePreference,
				stats: {
					create: {},
				},
			},
			select: {
				...UserRepository.select,
				email: true,
				role: true,
			} satisfies Record<
				keyof UserCreated,
				UserSelect[keyof UserCreated]
			>,
		});
	}

	getTokenData(
		userId: string,
		ctx?: DbContext,
	): Promise<UserTokenData | null> {
		return (ctx?.client ?? this.prisma).user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
			} satisfies Record<
				keyof UserTokenData,
				UserSelect[keyof UserTokenData]
			>,
		});
	}

	getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<UserLocalePreference | null> {
		return (ctx?.client ?? this.prisma).user.findUnique({
			where: { email },
			select: {
				localePreference: true,
				id: true,
			},
		});
	}

	async isByUserId(userId: string, ctx?: DbContext): Promise<boolean> {
		const user = await (ctx?.client ?? this.prisma).user.findUnique({
			where: { id: userId },
			select: {
				id: true,
			},
		});
		return user !== null;
	}
	async isByEmail(email: string, ctx?: DbContext): Promise<boolean> {
		const user = await (ctx?.client ?? this.prisma).user.findFirst({
			where: { email },
			select: { id: true },
		});
		return user !== null;
	}
	async isByUsername(username: string, ctx?: DbContext): Promise<boolean> {
		const user = await (ctx?.client ?? this.prisma).user.findFirst({
			where: { username },
			select: { id: true },
		});
		return user !== null;
	}
}
