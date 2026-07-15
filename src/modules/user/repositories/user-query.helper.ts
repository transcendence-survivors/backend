import {
	UserOrderByWithRelationInput,
	UserWhereInput,
} from '@prisma-generated/internal/prismaNamespaceBrowser';
import { UserOrderByEnum } from '../types/enums/user-order-by.enum';
import { UserListItem } from '../../../contracts/types/user/user-list-item.type';
import { FriendshipState } from '@prisma-generated/enums';
import { UserFeedEnum } from '../types/enums/user-feed.enum';

export class UserQueryHelper {
	public static readonly userSelect = {
		id: true,
		username: true,
		displayName: true,
		avatarUrl: true,
	} satisfies Record<keyof UserListItem, true>;

	public static readonly orderBy: Record<
		UserOrderByEnum,
		UserOrderByWithRelationInput[]
	> = {
		'created-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
		'created-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
		'username-asc': [{ username: 'asc' }, { id: 'asc' }],
		'username-desc': [{ username: 'desc' }, { id: 'desc' }],
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

	public static friendsWhere(userId: string): UserWhereInput {
		return {
			...UserQueryHelper.notBlockedWhere(userId),
			OR: [
				{
					friendshipsA: {
						some: {
							userBId: userId,
							state: FriendshipState.ACCEPTED,
						},
					},
				},
				{
					friendshipsB: {
						some: {
							userAId: userId,
							state: FriendshipState.ACCEPTED,
						},
					},
				},
			],
		};
	}

	public static notFriendsWhere(userId: string): UserWhereInput {
		return {
			...UserQueryHelper.notBlockedWhere(userId),
			AND: [
				{ id: { not: userId } },
				{
					friendshipsA: {
						none: {
							userBId: userId,
							OR: [
								{ state: FriendshipState.ACCEPTED },
								{ senderId: userId },
							],
						},
					},
				},
				{
					friendshipsB: {
						none: {
							userAId: userId,
							OR: [
								{ state: FriendshipState.ACCEPTED },
								{ senderId: userId },
							],
						},
					},
				},
			],
		};
	}

	public static feedWhere(
		userId: string,
		feedMode: UserFeedEnum,
	): UserWhereInput {
		switch (feedMode) {
			case UserFeedEnum.FRIENDS:
				return UserQueryHelper.friendsWhere(userId);
			case UserFeedEnum.NOT_FRIENDS:
				return UserQueryHelper.notFriendsWhere(userId);
			case UserFeedEnum.ALL_NOT_BLOCKED:
				return UserQueryHelper.notBlockedWhere(userId);
		}
	}
}
