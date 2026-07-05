import { BlockByIdResponse } from '@/modules/relationship/block/types/records/block-by-id-response';

export const BLOCK_SERVICE = Symbol('BLOCK_SERVICE');

export interface IBlockService {
	findBlockerBlockedById(
		userId: string,
		otherId: string,
	): Promise<[BlockByIdResponse | null, BlockByIdResponse | null]>;
}
