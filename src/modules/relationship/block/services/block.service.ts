import { Injectable } from '@nestjs/common';
import { BlockRepository } from '../repositories/block.repository';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import type { IUserService } from '@/contracts/services/user/user-service.port';
import {
	SelfBlockBadException,
	SelfUnblockBadException,
} from '../exceptions/block-bad.exception';
import { BlockConflictException } from '../exceptions/block-conflict.exception';
import { BlockNotFoundException } from '../exceptions/block-not-found.exceptions';
import { type IBlockService } from '@/contracts/services/block/block-service.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_EVENTS, BlockCreatedEvent } from '@/contracts/events/internal';
import { CursorService } from '@/shared/services/cursor.service';
import { BlockPaginateDto } from '../dtos/requests/block-paginate.dto';
import { BlockMapper } from '../mappers/block.mapper';
import { BlockPaginatedResponseDto } from '../dtos/responses/block-paginated-response.dto';
import { BlockCreatedResponseDto } from '../dtos/responses/block-created-response.dto';
import { BlockByIdResponse } from '../types/records/block-by-id-response';
import { BlockCountResponseDto } from '../dtos/responses/block-count-response.dto';
import { BlockCountDto } from '../dtos/requests/block-count.dto';
import { BlockListItemSelect } from '../types/records/block-list-item-select';
import { BlockedListItem } from '../types/records/block-list-item';

@Injectable()
export class BlockService implements IBlockService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly repo: BlockRepository,
		private readonly cursor: CursorService,
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: BlockMapper,
	) {}

	private toListItem(block: BlockListItemSelect): BlockedListItem {
		return {
			id: block.id,
			since: block.createdAt,
			blocked: {
				id: block.blocked.id,
				username: block.blocked.username,
				displayName: block.blocked.displayName,
				avatarUrl: block.blocked.avatarUrl,
			},
		};
	}

	async blockCursor(
		blockerId: string,
		{ limit, orderBy, cursor, search }: BlockPaginateDto,
	): Promise<BlockPaginatedResponseDto> {
		const data = await this.repo.cursor({
			blockerId,
			search,
			limit,
			cursor,
			orderBy,
		});

		const blockedUsers = data.map((block) => this.toListItem(block));
		const dtos = this.mapper.toListDto(blockedUsers);
		const result = this.cursor.create(dtos, limit, (user) => user.id);
		return this.mapper.toPaginatedDto(result);
	}
	async blockedCount(
		userId: string,
		{ search }: BlockCountDto,
	): Promise<BlockCountResponseDto> {
		const count = await this.repo.count({
			blockerId: userId,
			search: search,
		});
		return this.mapper.toCountDto(count);
	}

	async create(
		blockerId: string,
		blockedId: string,
	): Promise<BlockCreatedResponseDto> {
		if (blockerId === blockedId) throw new SelfBlockBadException();

		await this.userService.validateUserId(blockedId);
		const exist = await this.repo.findBlockedByIds({
			blockerId,
			blockedId,
		});
		if (exist) throw new BlockConflictException();

		const block = await this.repo.save({ blockerId, blockedId });
		this.eventEmitter.emit(
			APP_EVENTS.BLOCK_CREATED,
			new BlockCreatedEvent(blockerId, blockedId),
		);

		const blockedUser = this.toListItem(block);
		return this.mapper.toCreatedDto(blockedUser);
	}
	async remove(blockerId: string, blockedId: string): Promise<void> {
		if (blockerId === blockedId) throw new SelfUnblockBadException();

		const { count } = await this.repo.delete({
			blockerId,
			blockedId,
		});
		if (count === 0) throw new BlockNotFoundException();
	}

	findBlockerBlockedById(
		userId: string,
		otherId: string,
	): Promise<[BlockByIdResponse | null, BlockByIdResponse | null]> {
		return Promise.all([
			this.repo.findBlockedByIds({
				blockedId: otherId,
				blockerId: userId,
			}),
			this.repo.findBlockedByIds({
				blockedId: userId,
				blockerId: otherId,
			}),
		]);
	}
}
