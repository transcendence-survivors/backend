import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';
import type {
	FriendCursorQueryDto,
	FriendShipOrderBy,
} from '../dto/friend-base-query.dto';
import {
	FriendIdsQueryDto,
	FriendIdsQueryStatus,
} from '../dto/friendIds-query.dto';

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

type CursorFriendShips = FriendCursorQueryDto & {
	userId: string;
} & FriendShipStatusDirection;

type CursorFriendsFromIds = FriendIdsQueryDto & { userId: string };

type CountFriendshipsParams = {
	userId: string;
	search?: string;
} & FriendShipStatusDirection;

@Injectable()
export class FriendRepository {
	private readonly orderByCursorMapping: Record<
		FriendShipOrderBy,
		FriendshipOrderByWithRelationInput[]
	> = {
		createdAsc: [{ createdAt: 'asc' }, { id: 'asc' }],
		createdDesc: [{ createdAt: 'desc' }, { id: 'desc' }],
		updatedAsc: [{ updatedAt: 'asc' }, { id: 'asc' }],
		updatedDesc: [{ updatedAt: 'desc' }, { id: 'desc' }],
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
			OR: [
				{
					username: {
						contains: search as string,
						mode: 'insensitive',
					},
				},
				{
					displayName: {
						contains: search as string,
						mode: 'insensitive',
					},
				},
			],
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

	cursor({
		userId,
		limit,
		search,
		orderBy,
		cursor,
		...directionFilter
	}: CursorFriendShips) {
		return this.prisma.friendship.findMany({
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			where: {
				...this.searchCondition(userId, search),
				...this.getDirectionFilter(userId, directionFilter),
			},
			select: {
				id: true,
				state: true,
				userA: { select: UserRepository.userSelect },
				userB: { select: UserRepository.userSelect },
				createdAt: true,
				updatedAt: true,
			},
			orderBy: this.orderByCursorMapping[orderBy],
		});
	}

	count({ userId, search, ...directionFilter }: CountFriendshipsParams) {
		return this.prisma.friendship.count({
			where: {
				...this.searchCondition(userId, search),
				...this.getDirectionFilter(userId, directionFilter),
			},
		});
	}

	cursorIds(
		{
			userId,
			limit,
			orderBy,
			search,
			friendIds,
			cursor,
			status,
		}: CursorFriendsFromIds,
		ctx?: DbContext,
	) {
		const statusCondition =
			status === FriendIdsQueryStatus.IN
				? { in: friendIds }
				: { notIn: friendIds };

		const client = ctx?.client ?? this.prisma;
		return client.friendship.findMany({
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			where: {
				state: FriendshipState.ACCEPTED,
				...this.searchCondition(userId, search),
				OR: [
					{
						userAId: userId,
						userBId: statusCondition,
					},
					{
						userBId: userId,
						userAId: statusCondition,
					},
				],
			},
			select: {
				id: true,
				state: true,
				userA: { select: UserRepository.userSelect },
				userB: { select: UserRepository.userSelect },
				updatedAt: true,
			},
			orderBy: this.orderByCursorMapping[orderBy],
		});
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
				state: FriendshipState.PENDING,
				senderId: friendId,
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
			data: {
				state: FriendshipState.ACCEPTED,
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

	deleteOnStatus(
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
