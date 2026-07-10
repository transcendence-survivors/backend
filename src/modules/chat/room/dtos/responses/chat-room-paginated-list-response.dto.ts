import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ChatRoomListItemResponseDto } from './chat-room-list-item-response.dto';

@Exclude()
export class ChatRoomPaginatedListResponseDto extends CursorPaginationResultDto<ChatRoomListItemResponseDto> {
	@ApiProperty({
		type: [ChatRoomListItemResponseDto],
		description: 'List of chat rooms',
	})
	@Expose()
	@Type(() => ChatRoomListItemResponseDto)
	declare data: ChatRoomListItemResponseDto[];
}
