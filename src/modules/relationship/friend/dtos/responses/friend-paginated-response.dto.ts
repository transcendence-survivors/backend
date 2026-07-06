import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { FriendShipListItemResponseDto } from './friendship-list-item-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FriendshipPaginatedResponseDto extends CursorPaginationResultDto<FriendShipListItemResponseDto> {
	@ApiProperty({
		type: [FriendShipListItemResponseDto],
		description: 'The list of friendships',
	})
	@Expose()
	@Type(() => FriendShipListItemResponseDto)
	declare data: FriendShipListItemResponseDto[];
}
