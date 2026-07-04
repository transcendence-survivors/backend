import { BlockOrderBy } from '../repositories/block.repository';

export interface BlockCreate {
	userId: string;
	blockedUserId: string;
}

export interface BlockDelete {
	userId: string;
	blockedUserId: string;
}

export interface BlockedFindById {
	blockerId: string;
	blockedId: string;
}

export interface BlocksCursor {
	blockerId: string;
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: BlockOrderBy;
}

export interface BlockCountParams {
	blockerId: string;
	search?: string;
}
