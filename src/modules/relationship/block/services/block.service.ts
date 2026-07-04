import { Injectable } from '@nestjs/common';
import { BlockRepository } from '../repositories/block.repository';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import type { IUserService } from '@/contracts/services/user/user-service.port';
import {
	SelfBlockBadException,
	SelfUnblockBadException,
} from '../exceptions/block.bad.exception';
import { BlockConflictException } from '../exceptions/block.conflict.exception';
import { BlockNotFoundException } from '../exceptions/block.not-found.exceptions';
import { type IBlockService } from '@/contracts/services/block/block-service.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents, BlockCreatedEvent } from '@/contracts/events/internal';
import { CursorService } from '@/shared/services/cursor.service';
import {
	BlockCountQueryDto,
	BlockCursorQueryDto,
} from '../dto/blocker-query.dto';

@Injectable()
export class BlockService implements IBlockService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: BlockRepository,
		private readonly cursor: CursorService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async blockedCursor(userId: string, query: BlockCursorQueryDto) {
		const result = await this.repo.blockedCursor({
			blockerId: userId,
			...query,
		});

		const blockedUsers = result.map((block) => block.blocked);
		return this.cursor.create(blockedUsers, query.limit, (user) => user.id);
	}
	async blockedCount(userId: string, query: BlockCountQueryDto) {
		const count = await this.repo.blockedCount({
			blockerId: userId,
			...query,
		});
		return { count };
	}

	async create(userId: string, blockedUserId: string) {
		if (userId === blockedUserId) throw new SelfBlockBadException();

		await this.userService.validateUserId(blockedUserId);
		const exist = await this.repo.findBlockedById({
			blockerId: userId,
			blockedId: blockedUserId,
		});
		if (!exist) throw new BlockConflictException();

		const block = await this.repo.save({ userId, blockedUserId });
		this.eventEmitter.emit(
			AppEvents.BLOCK_CREATED,
			new BlockCreatedEvent(userId, blockedUserId),
		);
		return block;
	}
	async remove(userId: string, blockedUserId: string) {
		if (userId === blockedUserId) throw new SelfUnblockBadException();

		const { count } = await this.repo.delete({ userId, blockedUserId });
		if (count === 0) throw new BlockNotFoundException();
	}

	findBlockerBlockedById(userId: string, otherId: string) {
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
