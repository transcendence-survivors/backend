import { PrismaService } from '@/core/database/services/prisma.service';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import { Injectable } from '@nestjs/common';
import { FriendshipState } from '@prisma-generated/client';
import { FriendQueryHelper } from './friend-query.helper';
import type { FriendshipSelect } from '@prisma-generated/models';
import type { FriendShipsPaginateParams } from '../types/params/friendship-paginate.params';
import type { FriendshipsCountParams } from '../types/params/friendship-count.params';
import type { FriendIdsPaginateParams } from '../types/params/friend-ids-paginate-params';
import type { FriendIdsCountParams } from '../types/params/friend-ids-count.params';
import type { FriendRequestCreateParams } from '../types/params/friend-request-create.params';
import type { FriendRequestAcceptParams } from '../types/params/friend-request-accept.params';
import type { FriendShipDeleteParams } from '../types/params/friendship-delete.params';
import type { FriendShipBaseSelect } from '../types/records/friendship-base-select.type';
import type { FriendShipListItemSelect } from '../types/records/friendship-list-item-select.type';
import type { FriendShipFind } from '../types/records/friendship-find';
import { DbContext } from '@/core/database/uow/db-context';

@Injectable()
export class FriendRepository {
	private static readonly select = {
		id: true,
		state: true,
		userA: { select: UserQueryHelper.userSelect },
		userB: { select: UserQueryHelper.userSelect },
	} satisfies Record<
		keyof FriendShipBaseSelect,
		FriendshipSelect[keyof FriendShipBaseSelect]
	>;

	constructor(private readonly prisma: PrismaService) {}

	cursor({
		userId,
		limit,
		search,
		orderBy,
		cursor,
		...direction
	}: FriendShipsPaginateParams): Promise<FriendShipListItemSelect[]> {
		return this.prisma.friendship.findMany({
			...FriendQueryHelper.pagination(limit, cursor),
			where: FriendQueryHelper.listWhere(userId, search, direction),
			select: {
				...FriendRepository.select,
				createdAt: true,
				updatedAt: true,
			} satisfies Record<
				keyof FriendShipListItemSelect,
				FriendshipSelect[keyof FriendShipListItemSelect]
			>,
			orderBy: FriendQueryHelper.orderBy[orderBy],
		});
	}

	count({
		userId,
		search,
		...direction
	}: FriendshipsCountParams): Promise<number> {
		return this.prisma.friendship.count({
			where: FriendQueryHelper.listWhere(userId, search, direction),
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
	}: FriendIdsPaginateParams): Promise<FriendShipListItemSelect[]> {
		return this.prisma.friendship.findMany({
			...FriendQueryHelper.pagination(limit, cursor),
			where: FriendQueryHelper.idsWhere(
				userId,
				search,
				friendIds,
				status,
			),
			select: {
				...FriendRepository.select,
				updatedAt: true,
				createdAt: true,
			} satisfies Record<
				keyof FriendShipListItemSelect,
				FriendshipSelect[keyof FriendShipListItemSelect]
			>,
			orderBy: FriendQueryHelper.orderBy[orderBy],
		});
	}

	countIds({
		userId,
		search,
		friendIds,
		status,
	}: FriendIdsCountParams): Promise<number> {
		return this.prisma.friendship.count({
			where: FriendQueryHelper.idsWhere(
				userId,
				search,
				friendIds,
				status,
			),
		});
	}

	save(
		{ userId, friendId }: FriendRequestCreateParams,
		ctx?: DbContext,
	): Promise<FriendShipListItemSelect> {
		const client = ctx?.client ?? this.prisma;
		return client.friendship.create({
			data: {
				userAId: userId,
				userBId: friendId,
				senderId: userId,
				state: FriendshipState.PENDING,
			},
			select: {
				...FriendRepository.select,
				createdAt: true,
				updatedAt: true,
			} satisfies Record<
				keyof FriendShipListItemSelect,
				FriendshipSelect[keyof FriendShipListItemSelect]
			>,
		});
	}

	accept({ userId, friendId }: FriendRequestAcceptParams, ctx?: DbContext) {
		const client = ctx?.client ?? this.prisma;
		return client.friendship.updateMany({
			where: {
				state: FriendshipState.PENDING,
				senderId: friendId,
				...FriendQueryHelper.pairCondition(userId, friendId),
			},
			data: {
				state: FriendshipState.ACCEPTED,
			},
			limit: 1,
		});
	}

	delete({ userId, friendId, status }: FriendShipDeleteParams) {
		return this.prisma.friendship.deleteMany({
			where: {
				...(status && { state: status }),
				...FriendQueryHelper.pairCondition(userId, friendId),
			},
			limit: 1,
		});
	}

	findFriendShip(
		userId: string,
		friendId: string,
	): Promise<FriendShipFind | null> {
		return this.prisma.friendship.findFirst({
			where: FriendQueryHelper.pairCondition(userId, friendId),
			select: {
				id: true,
				state: true,
				senderId: true,
			} satisfies Record<
				keyof FriendShipFind,
				FriendshipSelect[keyof FriendShipFind]
			>,
		});
	}

	findFriendShipDetail(
		userId: string,
		friendId: string,
		ctx?: DbContext,
	): Promise<FriendShipListItemSelect | null> {
		const client = ctx?.client ?? this.prisma;
		return client.friendship.findFirst({
			where: FriendQueryHelper.pairCondition(userId, friendId),
			select: {
				...FriendRepository.select,
				createdAt: true,
				updatedAt: true,
			} satisfies Record<
				keyof FriendShipListItemSelect,
				FriendshipSelect[keyof FriendShipListItemSelect]
			>,
		});
	}
}
