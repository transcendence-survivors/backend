import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChatMessageOrderByEnum } from '../../types/enums/chat-message-order-by.enum';

export class ChatMessagePaginateDto {
	@ApiProperty({
		description: 'The maximum number of chat messages to return',
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
		enum: ChatMessageOrderByEnum,
		example: ChatMessageOrderByEnum['updated-desc'],
	})
	@IsOptional()
	@IsEnum(ChatMessageOrderByEnum)
	orderBy: ChatMessageOrderByEnum = ChatMessageOrderByEnum['created-desc'];

	@IsSearch({})
	search?: string;
}
