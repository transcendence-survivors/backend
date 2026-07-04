import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import {
	BlockWhereInput,
	type BlockOrderByWithRelationInput,
} from '@prisma-generated/models';
import {
	BlockCreate,
	BlockDelete,
	BlockedFindById,
	BlocksCursor,
} from '../types/block';
import { BlockCountQueryDto } from '../dto/blocker-query.dto';

export enum BlockOrderBy {
	'date-asc' = 'date-asc',
	'date-desc' = 'date-desc',
	'username-asc' = 'username-asc',
	'username-desc' = 'username-desc',
}

@Injectable()
export class BlockRepository {
	private readonly orderBy: Record<
		BlockOrderBy,
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

	blockedCursor(
		{ blockerId, cursor, limit, orderBy, search }: BlocksCursor,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.block.findMany({
			...this.pagination(limit, cursor),
			where: this.listWhere(blockerId, search),
			select: {
				...BlockRepository.select,
			},
			orderBy: this.orderBy[orderBy],
		});
	}
	blockedCount(
		{ blockerId, search }: BlockCountQueryDto & { blockerId: string },
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.block.count({
			where: this.listWhere(blockerId, search),
		});
	}

	save({ userId, blockedUserId }: BlockCreate, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).block.create({
			data: {
				blockerId: userId,
				blockedId: blockedUserId,
			},
			select: {
				id: true,
			},
		});
	}
	delete({ userId, blockedUserId }: BlockDelete, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).block.deleteMany({
			where: {
				blockerId: userId,
				blockedId: blockedUserId,
			},
		});
	}

	findBlockedById(
		{ blockerId, blockedId }: BlockedFindById,
		ctx?: DbContext,
	) {
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
}
