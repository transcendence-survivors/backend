import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChatRoomOrderByEnum } from '../../types/enums/chat-room-order-by.enum';
import { ChatRoomFeedEnum } from '../../types/enums/chat-room-feed-enum';

export class ChatRoomPaginateDto {
	@ApiProperty({
		description: 'The maximum number of chat rooms to return',
		example: 20,
		type: Number,
	})
	@IsCursorLimit({})
	limit: number = 10;

	@ApiPropertyOptional({
		description: 'The cursor to start the pagination from',
		type: String,
	})
	@IsCursor()
	cursor?: string;

	@ApiPropertyOptional({
		description: 'The order in which to sort the results',
		enum: ChatRoomOrderByEnum,
		example: ChatRoomOrderByEnum['updated-desc'],
	})
	@IsOptional()
	@IsEnum(ChatRoomOrderByEnum)
	orderBy: ChatRoomOrderByEnum = ChatRoomOrderByEnum['updated-desc'];

	@IsSearch({})
	search?: string;

	@IsOptional()
	@IsEnum(ChatRoomFeedEnum)
	feedMode: ChatRoomFeedEnum = ChatRoomFeedEnum.ALL;
}
