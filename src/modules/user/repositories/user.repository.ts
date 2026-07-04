import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import {
	UserOrderByWithRelationInput,
	UserWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { DbContext } from '@/core/database/uow/db-context';
import { UsersCountParams } from '../types/params/user-count.params';
import { UserListItem } from '../types/records/user-list-item.type';
import { UserProfileRecord } from '../types/records/user-profile.type';
import { UsersCursorParams } from '../types/params/user-cursor.params';
import { UserCreateParams } from '../types/params/user-create.params';
import { UserCreated } from '../types/records/user-created.type';
import { UserLocalePreference } from '../types/records/user-locale-preference.type';
import { UserTokenData } from '../types/records/user-token-data.type';
import { UserEmailUsername } from '../types/records/user-email-username.type';
import { UserEmailOrUsernameParams } from '../types/params/user-email-or-username.params';
import { UserOrderByEnum } from '../types/enums/user-order-by.enum';

@Injectable()
export class UserRepository {
	public static readonly userSelect = {
		id: true,
		username: true,
		displayName: true,
		avatarUrl: true,
	} satisfies Record<keyof UserListItem, true>;

	public static searchWhere(search: string): UserWhereInput {
		const query = search.trim();
		if (!query) {
			return {};
		}

		if (query.startsWith('@')) {
			return {
				username: {
					contains: query.slice(1),
					mode: 'insensitive',
				},
			};
		}
		return {
			OR: [
				{
					username: {
						contains: query,
						mode: 'insensitive',
					},
				},
				{
					displayName: {
						contains: query,
						mode: 'insensitive',
					},
				},
			],
		};
	}

	public static notBlockedWhere(userId: string): UserWhereInput {
		return {
			NOT: {
				OR: [
					{ blocksGiven: { some: { blockedId: userId } } },
					{ blocksReceived: { some: { blockerId: userId } } },
				],
			},
		};
	}

	private readonly orderBy: Record<
		UserOrderByEnum,
		UserOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
		'username-asc': { username: 'asc' },
		'username-desc': { username: 'desc' },
	};

	constructor(private readonly prisma: PrismaService) {}

	private pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	cursor(
		{ limit, cursor, search, orderBy, userId }: UsersCursorParams,
		ctx?: DbContext,
	): Promise<UserListItem[]> {
		const client = ctx?.client ?? this.prisma;
		return client.user.findMany({
			...this.pagination(limit, cursor),
			where: {
				...(search && UserRepository.searchWhere(search)),
				...(userId && UserRepository.notBlockedWhere(userId)),
			},
			orderBy: this.orderBy[orderBy],
			select: {
				...UserRepository.userSelect,
			} satisfies Record<keyof UserListItem, true>,
		});
	}

	cursorCount(
		{ search, userId }: UsersCountParams,
		ctx?: DbContext,
	): Promise<number> {
		const client = ctx?.client ?? this.prisma;
		return client.user.count({
			where: {
				...(search && UserRepository.searchWhere(search)),
				...(userId && UserRepository.notBlockedWhere(userId)),
			},
		});
	}

	profileByUsername(username: string): Promise<UserProfileRecord | null> {
		return this.prisma.user.findUnique({
			where: { username },
			select: {
				...UserRepository.userSelect,
				coverImageUrl: true,
				bio: true,
			} satisfies Record<keyof UserProfileRecord, true>,
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
			} satisfies Record<keyof UserEmailUsername, true>,
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
				...UserRepository.userSelect,
				email: true,
				role: true,
			},
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
			},
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
