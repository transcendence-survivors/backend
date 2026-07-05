import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { BlockListItemResponseDto } from './block-list-item-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class BlockPaginatedResponseDto extends CursorPaginationResultDto<BlockListItemResponseDto> {
	@ApiProperty({ type: [BlockListItemResponseDto] })
	@Expose()
	@Type(() => BlockListItemResponseDto)
	declare data: BlockListItemResponseDto[];
}
