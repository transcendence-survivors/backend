import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import { BlockSelect } from '@prisma-generated/models';
import type { BlocksPaginateParams } from '../types/params/block-cursor-params';
import type { BlockByIdsParams } from '../types/params/block-id.params';
import type { BlockCreateParams } from '../types/params/block-create.params';
import type { BlockDeleteParams } from '../types/params/block-delete.params';
import type { BlockListItemSelect } from '../types/records/block-list-item-select';
import type { BlockCountParams } from '../types/params/block-count.params';
import type { BlockByIdResponse } from '../types/records/block-by-id-response';
import { BlockQueryHelper } from './block-query.helper';

@Injectable()
export class BlockRepository {
	private static readonly select = {
		blocked: {
			select: UserQueryHelper.userSelect,
		},
	} satisfies Record<
		keyof BlockListItemSelect,
		BlockSelect[keyof BlockListItemSelect]
	>;

	constructor(private readonly prisma: PrismaService) {}

	cursor(
		{ blockerId, cursor, limit, orderBy, search }: BlocksPaginateParams,
		ctx?: DbContext,
	): Promise<BlockListItemSelect[]> {
		const client = ctx?.client ?? this.prisma;
		return client.block.findMany({
			...BlockQueryHelper.pagination(limit, cursor),
			where: BlockQueryHelper.listWhere(blockerId, search),
			select: {
				...BlockRepository.select,
			} satisfies Record<
				keyof BlockListItemSelect,
				BlockSelect[keyof BlockListItemSelect]
			>,
			orderBy: BlockQueryHelper.orderBy[orderBy],
		});
	}

	count(
		{ blockerId, search }: BlockCountParams,
		ctx?: DbContext,
	): Promise<number> {
		const client = ctx?.client ?? this.prisma;
		return client.block.count({
			where: BlockQueryHelper.listWhere(blockerId, search),
		});
	}

	save(
		{ blockerId, blockedId }: BlockCreateParams,
		ctx?: DbContext,
	): Promise<BlockListItemSelect> {
		return (ctx?.client ?? this.prisma).block.create({
			data: {
				blockerId: blockerId,
				blockedId: blockedId,
			},
			select: {
				...BlockRepository.select,
			} satisfies Record<
				keyof BlockListItemSelect,
				BlockSelect[keyof BlockListItemSelect]
			>,
		});
	}

	findBlockedByIds(
		{ blockerId, blockedId }: BlockByIdsParams,
		ctx?: DbContext,
	): Promise<BlockByIdResponse | null> {
		return (ctx?.client ?? this.prisma).block.findUnique({
			where: {
				blockerId_blockedId: {
					blockerId: blockerId,
					blockedId: blockedId,
				},
			},
			select: {
				id: true,
			},
		});
	}

	delete({ blockerId, blockedId }: BlockDeleteParams, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).block.deleteMany({
			where: {
				blockerId: blockerId,
				blockedId: blockedId,
			},
		});
	}
}
