import {
	UserOrderByWithRelationInput,
	UserWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { UserOrderByEnum } from '../types/enums/user-order-by.enum';
import { UserListItem } from '../types/records/user-list-item.type';

export class UserQueryHelper {
	public static readonly userSelect = {
		id: true,
		username: true,
		displayName: true,
		avatarUrl: true,
	} satisfies Record<keyof UserListItem, true>;

	public static readonly orderBy: Record<
		UserOrderByEnum,
		UserOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
		'username-asc': { username: 'asc' },
		'username-desc': { username: 'desc' },
	};

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

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
}
