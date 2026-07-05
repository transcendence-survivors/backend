import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import {
	BlockSelect,
	BlockWhereInput,
	type BlockOrderByWithRelationInput,
} from '@prisma-generated/models';
import { BlockOrderByEnum } from '../types/enums/block-order-by.enum';
import { BlocksPaginateParams } from '../types/params/block-cursor-params';
import { BlockByIdsParams } from '../types/params/block-id.params';
import { BlockCreateParams } from '../types/params/block-create.params';
import { BlockDeleteParams } from '../types/params/block-delete.params';
import { BlockListItemSelect } from '../types/records/block-list-item-select';
import { BlockCountParams } from '../types/params/block-count.params';
import { BlockByIdResponse } from '../types/records/block-by-id-response';

@Injectable()
export class BlockRepository {
	private readonly orderBy: Record<
		BlockOrderByEnum,
		BlockOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
		'username-asc': { blocked: { username: 'asc' } },
		'username-desc': { blocked: { username: 'desc' } },
	};

	private static readonly select = {
		blocked: {
			select: UserRepository.userSelect,
		},
	} satisfies Record<
		keyof BlockListItemSelect,
		BlockSelect[keyof BlockListItemSelect]
	>;

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
	private userSearch(search: string): BlockWhereInput['blocked'] {
		return UserRepository.searchWhere(search);
	}

	private listWhere(blockerId: string, search?: string): BlockWhereInput {
		return {
			blockerId,
			...(search && {
				blocked: {
					...this.userSearch(search),
				},
			}),
		};
	}

	cursor(
		{ blockerId, cursor, limit, orderBy, search }: BlocksPaginateParams,
		ctx?: DbContext,
	): Promise<BlockListItemSelect[]> {
		const client = ctx?.client ?? this.prisma;
		return client.block.findMany({
			...this.pagination(limit, cursor),
			where: this.listWhere(blockerId, search),
			select: {
				...BlockRepository.select,
			} satisfies Record<
				keyof BlockListItemSelect,
				BlockSelect[keyof BlockListItemSelect]
			>,
			orderBy: this.orderBy[orderBy],
		});
	}

	count(
		{ blockerId, search }: BlockCountParams,
		ctx?: DbContext,
	): Promise<number> {
		const client = ctx?.client ?? this.prisma;
		return client.block.count({
			where: this.listWhere(blockerId, search),
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
