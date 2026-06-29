import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';
import { FriendShipOrderBy } from '../dto/friend-base-query.dto';
import {
	FriendIdsQueryDto,
	FriendIdsQueryStatus,
} from '../dto/friendIds-query.dto';
import { FriendRequestCursorQuery } from '../dto/friend-request-query.dto';

interface CreateFriendShip {
	userId: string;
	friendId: string;
}
type AcceptFriendShip = CreateFriendShip;

interface DeleteFriendShip {
	userId: string;
	friendId: string;
	status: FriendshipState;
}

type FriendShipStatusDirection =
	| {
			status: Extract<FriendshipState, 'PENDING'>;
			direction: 'incoming' | 'outgoing';
	  }
	| {
			status: Extract<FriendshipState, 'ACCEPTED'>;
			direction?: never;
	  };

type CursorFriendShips = FriendRequestCursorQuery & {
	userId: string;
} & FriendShipStatusDirection;

type PaginateFriendsFromIds = FriendIdsQueryDto & {
	userId: string;
};

@Injectable()
export class FriendRepository {
	private readonly orderByMapping: Record<
		FriendShipOrderBy,
		FriendshipOrderByWithRelationInput
	> = {
		createdAsc: { createdAt: 'asc' },
		createdDesc: { createdAt: 'desc' },
	};

	private readonly orderByCursorMapping: Record<
		FriendShipOrderBy,
		FriendshipOrderByWithRelationInput[]
	> = {
		createdAsc: [{ createdAt: 'asc' }, { id: 'asc' }],
		createdDesc: [{ createdAt: 'desc' }, { id: 'desc' }],
	};

	constructor(private readonly prisma: PrismaService) {}

	private getDirectionFilter(
		userId: string,
		{ status, direction }: FriendShipStatusDirection,
	): FriendshipWhereInput {
		if (status === FriendshipState.PENDING) {
			if (direction === 'incoming') {
				return { state: status, senderId: { not: userId } };
			}
			return { state: status, senderId: userId };
		}
		return { state: status };
	}

	private searchCondition(
		userId: string,
		search?: string,
	): FriendshipWhereInput {
		const userSearchCondition: FriendshipWhereInput['userA'] = {
			username: {
				contains: search as string,
				mode: 'insensitive',
			},
		};
		return {
			OR: [
				{
					userAId: userId,
					...(search && { userB: userSearchCondition }),
				},
				{
					userBId: userId,
					...(search && { userA: userSearchCondition }),
				},
			],
		};
	}

	findCursor({
		userId,
		status,
		direction,
		limit,
		search,
		orderBy,
		cursor,
	}: CursorFriendShips) {
		return this.prisma.friendship.findMany({
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			where: {
				...this.searchCondition(userId, search),
				...this.getDirectionFilter(userId, {
					status,
					direction,
				}),
			},
			orderBy: this.orderByCursorMapping[orderBy],
			select: {
				id: true,
				state: true,
				userA: { select: UserRepository.userSelect },
				userB: { select: UserRepository.userSelect },
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	count({
		userId,
		search,
		direction,
		status,
	}: Pick<CursorFriendShips, 'userId' | 'search' | 'direction' | 'status'>) {
		return this.prisma.friendship.count({
			where: {
				...this.searchCondition(userId, search),
				...this.getDirectionFilter(userId, {
					status,
					direction,
				}),
			},
		});
	}

	paginateFromIds(
		{
			userId,
			page,
			limit,
			orderBy,
			search,
			friendIds,
			status,
		}: PaginateFriendsFromIds,
		ctx?: DbContext,
	) {
		const statusCondition =
			status === FriendIdsQueryStatus.IN
				? { in: friendIds }
				: { notIn: friendIds };

		const userSearchCondition: FriendshipWhereInput['userA'] = {
			username: { contains: search as string, mode: 'insensitive' },
		};

		const where: FriendshipWhereInput = {
			state: FriendshipState.ACCEPTED,
			OR: [
				{
					userAId: userId,
					userBId: statusCondition,
					...(search && {
						userB: userSearchCondition,
					}),
				},
				{
					userBId: userId,
					userAId: statusCondition,
					...(search && {
						userA: userSearchCondition,
					}),
				},
			],
		};

		const client = ctx?.client ?? this.prisma;
		const skip = (page - 1) * limit;
		return Promise.all([
			client.friendship.findMany({
				skip,
				take: limit,
				where,
				select: {
					id: true,
					state: true,
					userA: { select: UserRepository.userSelect },
					userB: { select: UserRepository.userSelect },
					createdAt: true,
					updatedAt: true,
				},
				orderBy: this.orderByMapping[orderBy],
			}),
			client.friendship.count({ where }),
		]);
	}

	save({ userId, friendId }: CreateFriendShip, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).friendship.create({
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

	accept({ userId, friendId }: AcceptFriendShip, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).friendship.updateMany({
			where: {
				OR: [
					{
						userAId: userId,
						userBId: friendId,
						senderId: friendId,
						state: FriendshipState.PENDING,
					},
					{
						userAId: friendId,
						userBId: userId,
						senderId: friendId,
						state: FriendshipState.PENDING,
					},
				],
			},
			data: {
				state: FriendshipState.ACCEPTED,
			},
		});
	}

	deleteFromState(
		{ userId, friendId, status }: DeleteFriendShip,
		ctx?: DbContext,
	) {
		return (ctx?.client ?? this.prisma).friendship.deleteMany({
			where: {
				state: status,
				OR: [
					{
						userAId: userId,
						userBId: friendId,
					},
					{
						userAId: friendId,
						userBId: userId,
					},
				],
			},
		});
	}

	delete(
		{ userId, friendId }: Omit<DeleteFriendShip, 'status'>,
		ctx?: DbContext,
	) {
		return (ctx?.client ?? this.prisma).friendship.deleteMany({
			where: {
				OR: [
					{
						userAId: userId,
						userBId: friendId,
					},
					{
						userAId: friendId,
						userBId: userId,
					},
				],
			},
		});
	}

	findFriendShip(userId: string, friendId: string, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).friendship.findFirst({
			where: {
				OR: [
					{
						userAId: userId,
						userBId: friendId,
					},
					{
						userAId: friendId,
						userBId: userId,
					},
				],
			},
			select: {
				id: true,
				state: true,
				senderId: true,
			},
		});
	}
}
