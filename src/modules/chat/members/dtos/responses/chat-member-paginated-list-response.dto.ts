import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ChatMemberListItemResponseDto } from './chat-member-list-item-response.dto';

@Exclude()
export class ChatMemberPaginatedListResponseDto extends CursorPaginationResultDto<ChatMemberListItemResponseDto> {
	@ApiProperty({
		type: [ChatMemberListItemResponseDto],
		description: 'List of chat members',
	})
	@Expose()
	@Type(() => ChatMemberListItemResponseDto)
	declare data: ChatMemberListItemResponseDto[];
}
