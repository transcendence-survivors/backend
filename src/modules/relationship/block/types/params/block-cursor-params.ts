import { BlockOrderByEnum } from '../enums/block-order-by.enum';

export interface BlocksPaginateParams {
	blockerId: string;
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: BlockOrderByEnum;
}
