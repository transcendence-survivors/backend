import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChatMemberOrderByEnum } from '../../types/enums/chat-member-order-by.enum';

export class ChatMemberPaginateDto {
	@ApiProperty({
		description: 'The maximum number of chat members to return',
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
		enum: ChatMemberOrderByEnum,
		example: ChatMemberOrderByEnum['joined-desc'],
	})
	@IsOptional()
	@IsEnum(ChatMemberOrderByEnum)
	orderBy: ChatMemberOrderByEnum = ChatMemberOrderByEnum['joined-desc'];

	@IsSearch({})
	search?: string;
}
