import { PrismaService } from '@/core/database/services/prisma.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';
import { FriendShipOrderByEnum } from '../types/enums/friend-order-by.enum';
import { FriendIdsStatus } from '../types/enums/friend-ids-status.enum';
import { FriendShipStatusDirectionParams } from '../types/params/friendship-status-direction.params';
import { FriendRequestDirection } from '../types/enums/friend-request-directions.enum';
import { FriendShipsPaginateParams } from '../types/params/friendship-paginate.params';
import { FriendshipsCountParams } from '../types/params/friendship-count.params';
import { FriendIdsPaginateParams } from '../types/params/friend-ids-paginate-params';
import { FriendIdsCountParams } from '../types/params/friend-ids-count.params';
import { FriendRequestCreateParams } from '../types/params/friend-request-create.params';
import { FriendRequestAcceptParams } from '../types/params/friend-request-accept.params';
import { FriendShipDeleteParams } from '../types/params/friendship-delete.params';

@Injectable()
export class FriendRepository {
	private static readonly select = {
		id: true,
		state: true,
		userA: { select: UserRepository.userSelect },
		userB: { select: UserRepository.userSelect },
	};

	private readonly orderBy: Record<
		FriendShipOrderByEnum,
		FriendshipOrderByWithRelationInput[]
	> = {
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
	private pairCondition(
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

	private userSearch(search: string): FriendshipWhereInput['userA'] {
		if (search.startsWith('@')) {
			return {
				username: {
					contains: search.slice(1),
					mode: 'insensitive',
				},
			};
		}
		return {
			OR: [
				{
					username: {
						contains: search,
						mode: 'insensitive',
					},
				},
				{
					displayName: {
						contains: search,
						mode: 'insensitive',
					},
				},
			],
		};
	}

	private participantCondition(
		userId: string,
		search?: string,
	): FriendshipWhereInput {
		return {
			OR: [
				{
					userAId: userId,
					...(search && {
						userB: {
							...this.userSearch(search),
						},
					}),
				},
				{
					userBId: userId,
					...(search && {
						userA: {
							...this.userSearch(search),
						},
					}),
				},
			],
		};
	}
	private statusCondition(
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

	private idsWhere(
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
				this.participantCondition(userId, search),
				{
					OR: [
						{ userAId: userId, userBId: idsCondition },
						{ userBId: userId, userAId: idsCondition },
					],
				},
			],
		};
	}

	private listWhere(
		userId: string,
		search: string | undefined,
		direction: FriendShipStatusDirectionParams,
	): FriendshipWhereInput {
		return {
			...this.participantCondition(userId, search),
			...this.statusCondition(userId, direction),
		};
	}

	cursor({
		userId,
		limit,
		search,
		orderBy,
		cursor,
		...direction
	}: FriendShipsPaginateParams) {
		return this.prisma.friendship.findMany({
			...this.pagination(limit, cursor),
			where: this.listWhere(userId, search, direction),
			select: {
				...FriendRepository.select,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: this.orderBy[orderBy],
		});
	}

	count({ userId, search, ...direction }: FriendshipsCountParams) {
		return this.prisma.friendship.count({
			where: this.listWhere(userId, search, direction),
		});
	}

	cursorIds({
		userId,
		limit,
		orderBy,
		search,
		friendIds,
		cursor,
		status,
	}: FriendIdsPaginateParams) {
		return this.prisma.friendship.findMany({
			...this.pagination(limit, cursor),
			where: this.idsWhere(userId, search, friendIds, status),
			select: {
				...FriendRepository.select,
				updatedAt: true,
			},
			orderBy: this.orderBy[orderBy],
		});
	}

	countIds({ userId, search, friendIds, status }: FriendIdsCountParams) {
		return this.prisma.friendship.count({
			where: this.idsWhere(userId, search, friendIds, status),
		});
	}

	save({ userId, friendId }: FriendRequestCreateParams) {
		return this.prisma.friendship.create({
			data: {
				userAId: userId,
				userBId: friendId,
				senderId: userId,
				state: FriendshipState.PENDING,
			},
			select: {
				id: true,
			},
		});
	}

	accept({ userId, friendId }: FriendRequestAcceptParams) {
		return this.prisma.friendship.updateMany({
			where: {
				state: FriendshipState.PENDING,
				senderId: friendId,
				...this.pairCondition(userId, friendId),
			},
			data: {
				state: FriendshipState.ACCEPTED,
			},
		});
	}

	delete({ userId, friendId, status }: FriendShipDeleteParams) {
		return this.prisma.friendship.deleteMany({
			where: {
				...(status && { state: status }),
				...this.pairCondition(userId, friendId),
			},
		});
	}

	findFriendShip(userId: string, friendId: string) {
		return this.prisma.friendship.findFirst({
			where: this.pairCondition(userId, friendId),
			select: {
				id: true,
				state: true,
				senderId: true,
			},
		});
	}
}
