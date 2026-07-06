import { UserQueryHelper } from '@/modules/user/user.public-api';
import type {
	BlockOrderByWithRelationInput,
	BlockWhereInput,
} from '@prisma-generated/models';
import { BlockOrderByEnum } from '../types/enums/block-order-by.enum';

export class BlockQueryHelper {
	public static readonly orderBy: Record<
		BlockOrderByEnum,
		BlockOrderByWithRelationInput
	> = {
		'date-asc': { createdAt: 'asc' },
		'date-desc': { createdAt: 'desc' },
		'username-asc': { blocked: { username: 'asc' } },
		'username-desc': { blocked: { username: 'desc' } },
	};

	public static pagination(limit: number, cursor?: string) {
		return {
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor },
				skip: 1,
			}),
		};
	}

	public static userSearch(search: string): BlockWhereInput['blocked'] {
		return UserQueryHelper.searchWhere(search);
	}

	public static listWhere(
		blockerId: string,
		search?: string,
	): BlockWhereInput {
		return {
			blockerId,
			...(search && {
				blocked: {
					...BlockQueryHelper.userSearch(search),
				},
			}),
		};
	}
}
