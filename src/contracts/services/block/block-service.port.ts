import { Block } from '@prisma-generated/client';

export const BLOCK_SERVICE = Symbol('BLOCK_SERVICE');

export type FindBlockById = Pick<Block, 'id'>;

export interface IBlockService {
	findBlockerBlockedById(
		userId: string,
		otherId: string,
	): Promise<[FindBlockById | null, FindBlockById | null]>;
}
