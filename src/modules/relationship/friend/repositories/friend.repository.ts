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
	FriendIdsCountQueryDto,
	type FriendIdsQueryDto,
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
	status?: FriendshipState;
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

type CursorFriendShips = FriendCursorQueryDto &
	FriendShipStatusDirection & { userId: string };

type CursorFriendsFromIds = FriendIdsQueryDto & { userId: string };
type CountFriendFromIds = FriendIdsCountQueryDto & { userId: string };

type CountFriendshipsParams = {
	userId: string;
	search?: string;
} & FriendShipStatusDirection;

@Injectable()
export class FriendRepository {
	private static readonly select = {
		id: true,
		state: true,
		userA: { select: UserRepository.userSelect },
		userB: { select: UserRepository.userSelect },
	};

	private readonly orderBy: Record<
		FriendShipOrderBy,
		FriendshipOrderByWithRelationInput[]
	> = {
		createdAsc: [{ createdAt: 'asc' }, { id: 'asc' }],
		createdDesc: [{ createdAt: 'desc' }, { id: 'desc' }],
		updatedAsc: [{ updatedAt: 'asc' }, { id: 'asc' }],
		updatedDesc: [{ updatedAt: 'desc' }, { id: 'desc' }],
		userNameAsc: [
			{ userA: { username: 'asc' } },
			{ userB: { username: 'asc' } },
			{ id: 'asc' },
		],
		userNameDesc: [
			{ userA: { username: 'desc' } },
			{ userB: { username: 'desc' } },
			{ id: 'desc' },
		],
	};

	constructor(private readonly prisma: PrismaService) {}

	private client(ctx?: DbContext) {
		return ctx?.client ?? this.prisma;
	}

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
		{ status, direction }: FriendShipStatusDirection,
	): FriendshipWhereInput {
		if (status === FriendshipState.ACCEPTED) {
			return { state: FriendshipState.ACCEPTED };
		}

		return {
			state: FriendshipState.PENDING,
			senderId: direction === 'incoming' ? { not: userId } : userId,
		};
	}
	private idsWhere(
		userId: string,
		search: string | undefined,
		friendIds: string[],
		status: FriendIdsQueryStatus,
	): FriendshipWhereInput {
		const idsCondition =
			status === FriendIdsQueryStatus.IN
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
		direction: FriendShipStatusDirection,
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
	}: CursorFriendShips) {
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

	count({ userId, search, ...direction }: CountFriendshipsParams) {
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
	}: CursorFriendsFromIds) {
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

	countIds({ userId, search, friendIds, status }: CountFriendFromIds) {
		return this.prisma.friendship.count({
			where: this.idsWhere(userId, search, friendIds, status),
		});
	}

	save({ userId, friendId }: CreateFriendShip) {
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

	accept({ userId, friendId }: AcceptFriendShip) {
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

	delete({ userId, friendId, status }: DeleteFriendShip) {
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
