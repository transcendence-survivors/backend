import { Injectable } from '@nestjs/common';
import { BlockRepository } from '../repositories/block.repository';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import type { IUserService } from '@/contracts/services/user/user-service.port';
import { BadBlockException } from '../exceptions/block.bad.exception';
import { BlockConflictException } from '../exceptions/block.conflict.exception';
import { BlockNotFoundException } from '../exceptions/block.not-found.exceptions';
import { BlockQueryDto } from '../dto/blocker-query.dto';
import { PaginationService } from '@/shared/services/pagination.service';
import { type IBlockService } from '@/contracts/services/block/block-service.port';

@Injectable()
export class BlockService implements IBlockService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: BlockRepository,
		private readonly pagination: PaginationService,
	) {}

	async create(userId: string, blockedUserId: string) {
		if (userId === blockedUserId) throw new BadBlockException();

		const isBlocked = await this.repo.isBlocked(userId, blockedUserId);
		if (isBlocked) throw new BlockConflictException();

		await this.userService.validateUserId(blockedUserId);
		return this.repo.save({ userId, blockedUserId });
	}

	async remove(userId: string, blockedUserId: string) {
		if (userId === blockedUserId) throw new BadBlockException();

		const isBlocked = await this.repo.isBlocked(userId, blockedUserId);
		if (!isBlocked) throw new BlockNotFoundException();

		return this.repo.delete({ userId, blockedUserId });
	}

	async findPage(userId: string, query: BlockQueryDto) {
		const { page, limit, orderBy, username } = query;
		const [data, total] = await this.repo.paginate({
			userId,
			page,
			limit,
			orderBy,
			username,
		});
		const blockedUsers = data.map((block) => block.blocked);
		return this.pagination.create(blockedUsers, page, limit, total);
	}

	findBlockedBlockerById(userId: string, otherId: string) {
		return Promise.all([
			this.repo.findBlockedById({
				blockedId: otherId,
				blockerId: userId,
			}),
			this.repo.findBlockedById({
				blockedId: userId,
				blockerId: otherId,
			}),
		]);
	}
}
