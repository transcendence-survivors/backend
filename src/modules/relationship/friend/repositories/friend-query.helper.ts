import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';
import { FriendShipOrderByEnum } from '../types/enums/friend-order-by.enum';
import { FriendIdsStatus } from '../types/enums/friend-ids-status.enum';
import { FriendRequestDirection } from '../types/enums/friend-request-directions.enum';
import { FriendShipStatusDirectionParams } from '../types/params/friendship-status-direction.params';
import { UserQueryHelper } from '@/modules/user/user.public-api';

export class FriendQueryHelper {
	public static readonly orderBy = {
		'created-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
		'created-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
		'updated-asc': [{ updatedAt: 'asc' }, { id: 'asc' }],
		'updated-desc': [{ updatedAt: 'desc' }, { id: 'desc' }],
		'username-asc': [
			{ userA: { username: 'asc' } },
			{ userB: { username: 'asc' } },
			{ id: 'asc' },
		],
		'username-desc': [
			{ userA: { username: 'desc' } },
			{ userB: { username: 'desc' } },
			{ id: 'desc' },
		],
		'displayName-asc': [
			{ userA: { displayName: 'asc' } },
			{ userB: { displayName: 'asc' } },
			{ id: 'asc' },
		],
		'displayName-desc': [
			{ userA: { displayName: 'desc' } },
			{ userB: { displayName: 'desc' } },
			{ id: 'desc' },
		],
	} satisfies Record<
		FriendShipOrderByEnum,
		FriendshipOrderByWithRelationInput[]
	>;

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	public static pairCondition(
		userId: string,
		friendId: string,
	): FriendshipWhereInput {
		return {
			OR: [
				{ userAId: userId, userBId: friendId },
				{ userAId: friendId, userBId: userId },
			],
		};
	}

	public static participantCondition(
		userId: string,
		search?: string,
	): FriendshipWhereInput {
		return {
			OR: [
				{
					userAId: userId,
					...(search && {
						userB: {
							...UserQueryHelper.searchWhere(search),
						},
					}),
				},
				{
					userBId: userId,
					...(search && {
						userA: {
							...UserQueryHelper.searchWhere(search),
						},
					}),
				},
			],
		};
	}

	public static statusCondition(
		userId: string,
		{ status, direction }: FriendShipStatusDirectionParams,
	): FriendshipWhereInput {
		if (status === FriendshipState.ACCEPTED) {
			return { state: FriendshipState.ACCEPTED };
		}

		return {
			state: FriendshipState.PENDING,
			senderId:
				direction === FriendRequestDirection.incoming
					? { not: userId }
					: userId,
		};
	}

	public static idsWhere(
		userId: string,
		search: string | undefined,
		friendIds: string[],
		status: FriendIdsStatus,
	): FriendshipWhereInput {
		const idsCondition =
			status === FriendIdsStatus.IN
				? { in: friendIds }
				: { notIn: friendIds };

		return {
			state: FriendshipState.ACCEPTED,
			AND: [
				FriendQueryHelper.participantCondition(userId, search),
				{
					OR: [
						{ userAId: userId, userBId: idsCondition },
						{ userBId: userId, userAId: idsCondition },
					],
				},
			],
		};
	}

	public static listWhere(
		userId: string,
		search: string | undefined,
		direction: FriendShipStatusDirectionParams,
	): FriendshipWhereInput {
		return {
			...FriendQueryHelper.participantCondition(userId, search),
			...FriendQueryHelper.statusCondition(userId, direction),
		};
	}
}
