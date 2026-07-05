import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { FriendShipListItemResponseDto } from './friendship-list-item-response.do';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FriendshipPaginatedResponseDto extends CursorPaginationResultDto<FriendShipListItemResponseDto> {
	@ApiProperty({ type: [FriendShipListItemResponseDto] })
	@Expose()
	@Type(() => FriendShipListItemResponseDto)
	declare data: FriendShipListItemResponseDto[];
}
