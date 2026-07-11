import { PrismaService } from '@/core/database/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { DbContext } from '@/core/database/uow/db-context';
import { UserQueryHelper } from '@/modules/user/user.public-api';
import {
	CommentOrderByWithRelationInput,
	CommentSelect,
} from '@prisma-generated/models';

export const COMMENT_ORDER_BY = ['date-asc', 'date-desc'] as const;
export type CommentOrderBy = (typeof COMMENT_ORDER_BY)[number];

@Injectable()
export class CommentRepository {
	static readonly commentSelect = {
		id: true,
		content: true,
		createdAt: true,
		imageUrl: true,
		user: {
			select: UserQueryHelper.userSelect,
		},
	} satisfies CommentSelect;

	private readonly orderByCursorMapping: Record<
		CommentOrderBy,
		CommentOrderByWithRelationInput[]
	> = {
		'date-asc': [{ createdAt: 'asc' }, { id: 'asc' }],
		'date-desc': [{ createdAt: 'desc' }, { id: 'desc' }],
	};

	constructor(private readonly prisma: PrismaService) {}

	create(
		userId: string,
		postId: string,
		content?: string,
		imageUrl?: string,
	) {
		return this.prisma.comment.create({
			data: {
				userId,
				postId,
				content,
				imageUrl,
			},
		});
	}

	cursor(
		postId: string,
		{ limit, cursor, orderBy }: CommentQueryDto,
		ctx?: DbContext,
	) {
		const client = ctx?.client ?? this.prisma;
		return client.comment.findMany({
			take: limit + 1,
			where: { postId },
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
			orderBy: this.orderByCursorMapping[orderBy],
			select: CommentRepository.commentSelect,
		});
	}
}
