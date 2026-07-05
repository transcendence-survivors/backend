import { Injectable } from '@nestjs/common';
import { BlockedListItem } from '../types/records/block-list-item';
import { BlockListItemResponseDto } from '../dto/responses/block-list-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { BlockPaginatedResponseDto } from '../dto/responses/block-paginated-response.dto';
import { BlockCountResponseDto } from '../dto/responses/block-count-response.dto';
import { BlockCreatedResponseDto } from '../dto/responses/block-created-response.dto';

@Injectable()
export class BlockMapper {
	private toListItemDto(block: BlockedListItem): BlockListItemResponseDto {
		return plainToInstance(BlockListItemResponseDto, block, {
			excludeExtraneousValues: true,
		});
	}

	toCountDto(count: number): BlockCountResponseDto {
		return plainToInstance(
			BlockCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toPaginatedDto(
		paginationBlocks: CursorPaginationResult<BlockListItemResponseDto>,
	): BlockPaginatedResponseDto {
		return plainToInstance(BlockPaginatedResponseDto, paginationBlocks, {
			excludeExtraneousValues: true,
		});
	}

	toListDto(blocks: BlockedListItem[]): BlockListItemResponseDto[] {
		return blocks.map((b) => this.toListItemDto(b));
	}

	toCreatedDto(block: BlockedListItem): BlockCreatedResponseDto {
		return plainToInstance(BlockCreatedResponseDto, block, {
			excludeExtraneousValues: true,
		});
	}
}
