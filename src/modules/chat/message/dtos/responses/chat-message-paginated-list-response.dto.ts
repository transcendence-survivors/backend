import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ChatMessageListItemResponseDto } from './chat-room-list-item-response.dto';

@Exclude()
export class ChatMessagePaginatedListResponseDto extends CursorPaginationResultDto<ChatMessageListItemResponseDto> {
	@ApiProperty({
		type: [ChatMessageListItemResponseDto],
		description: 'List of chat rooms',
	})
	@Expose()
	@Type(() => ChatMessageListItemResponseDto)
	declare data: ChatMessageListItemResponseDto[];
}
