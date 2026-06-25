import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import type {
	FriendshipOrderByWithRelationInput,
	FriendshipWhereInput,
} from '@prisma-generated/models';

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
}

interface PaginateFriendShips {
	userId: string;
	page: number;
	limit: number;
	orderBy: FriendShipOrderBy;
	search?: string;
	status: FriendshipState;
}

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
		{ userId, page, limit, orderBy, search, status }: PaginateFriendShips,
		ctx?: DbContext,
	) {
		const skip = (page - 1) * limit;
		const client = ctx?.client ?? this.prisma;

		const where: FriendshipWhereInput = {
			state: status,
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

	delete({ userId, friendId }: DeleteFriendShip, ctx?: DbContext) {
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
