import { PrismaService } from '@/core/database/services/prisma.service';
import { DbContext } from '@/core/database/uow/db-context';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { type BlockOrderByWithRelationInput } from '@prisma-generated/models';

export const BLOCK_ORDER_BY = [
	'createdAsc',
	'createdDesc',
	'usernameAsc',
	'usernameDesc',
] as const;

export type BlockOrderBy = (typeof BLOCK_ORDER_BY)[number];

interface CreateBlock {
	userId: string;
	blockedUserId: string;
}

interface DeleteBlock {
	userId: string;
	blockedUserId: string;
}

interface PaginateBlocks {
	userId: string;
	page: number;
	limit: number;
	orderBy: BlockOrderBy;
	username?: string;
}

@Injectable()
export class BlockRepository {
	private readonly orderByMapping: Record<
		BlockOrderBy,
		BlockOrderByWithRelationInput
	> = {
		createdAsc: { createdAt: 'asc' },
		createdDesc: { createdAt: 'desc' },
		usernameAsc: { blocked: { username: 'asc' } },
		usernameDesc: { blocked: { username: 'desc' } },
	};

	constructor(private readonly prisma: PrismaService) {}

	paginate(
		{ userId, page, limit, orderBy, username }: PaginateBlocks,
		ctx?: DbContext,
	) {
		const skip = (page - 1) * limit;
		const client = ctx?.client ?? this.prisma;

		return Promise.all([
			client.block.findMany({
				skip,
				take: limit,
				where: {
					blocked: {
						username: username
							? {
									contains: username,
									mode: 'insensitive',
								}
							: undefined,
					},
					blockerId: userId,
				},
				select: {
					blocked: {
						select: UserRepository.userSelect,
					},
				},
				orderBy: this.orderByMapping[orderBy],
			}),
			client.block.count(),
		]);
	}

	save({ userId, blockedUserId }: CreateBlock, ctx?: DbContext) {
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

	delete({ userId, blockedUserId }: DeleteBlock, ctx?: DbContext) {
		return (ctx?.client ?? this.prisma).block.delete({
			where: {
				blockerId_blockedId: {
					blockerId: userId,
					blockedId: blockedUserId,
				},
			},
		});
	}

	async isBlocked(userId: string, blockedUserId: string, ctx?: DbContext) {
		const block = await (ctx?.client ?? this.prisma).block.findUnique({
			where: {
				blockerId_blockedId: {
					blockerId: userId,
					blockedId: blockedUserId,
				},
			},
			select: {
				id: true,
			},
		});
		return block !== null;
	}
}
