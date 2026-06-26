import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';
import { FriendBaseQueryDto } from '../dto/friend-base-query.dto';

export const FRIENDSHIP_ORDER_BY = ['createdAsc', 'createdDesc'] as const;

export type FriendShipOrderBy = (typeof FRIENDSHIP_ORDER_BY)[number];

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

type PaginateFriendShips = FriendBaseQueryDto & {
	userId: string;
} & (
		| {
				status: Extract<FriendshipState, 'PENDING'>;
				direction: 'incoming' | 'outgoing';
		  }
		| {
				status: Extract<FriendshipState, 'ACCEPTED'>;
				direction?: never;
		  }
	);

@Injectable()
export class FriendRepository {
	private readonly orderByMapping: Record<
		FriendShipOrderBy,
		FriendshipOrderByWithRelationInput
	> = {
		createdAsc: { createdAt: 'asc' },
		createdDesc: { createdAt: 'desc' },
	};

	constructor(private readonly prisma: PrismaService) {}

	paginate(
		{
			userId,
			page,
			limit,
			orderBy,
			search,
			status,
			direction,
		}: PaginateFriendShips,
		ctx?: DbContext,
	) {
		const where: FriendshipWhereInput = {
			state: status,
			senderId:
				status === FriendshipState.PENDING
					? direction === 'incoming'
						? { not: userId }
						: userId
					: undefined,
			OR: [
				{
					userAId: userId,
					...(search && {
						userB: {
							username: { contains: search, mode: 'insensitive' },
						},
					}),
				},
				{
					userBId: userId,
					...(search && {
						userA: {
							username: { contains: search, mode: 'insensitive' },
						},
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
