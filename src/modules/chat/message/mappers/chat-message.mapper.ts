import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChatMessageListItemResponseDto } from '../dtos/responses/chat-message-list-item-response.dto';
import { ChatMessageListItem } from '../types/records/chat-message-list-item';
import { ChatMessagePaginatedListResponseDto } from '../dtos/responses/chat-message-paginated-list-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { ChatMessageCountResponseDto } from '../dtos/responses/chat-message-count-response.dto';

@Injectable()
export class ChatMessageMapper {
	toListItemDto(
		message: ChatMessageListItem,
	): ChatMessageListItemResponseDto {
		return plainToInstance(
			ChatMessageListItemResponseDto,
			{
				...message,
				sender: {
					...message.sender,
					role: message.sender?.chatMemberships?.[0]?.role ?? null,
				},
				metadata: {
					...message.metadata,
					targetUser: {
						...message.metadata?.targetUser,
						role:
							message.metadata?.targetUser?.chatMemberships?.[0]
								?.role ?? null,
					},
				},
			},
			{
				excludeExtraneousValues: true,
			},
		);
	}

	toListItemDtoList(
		messages: ChatMessageListItem[],
	): ChatMessageListItemResponseDto[] {
		return messages.map((message) => this.toListItemDto(message));
	}

	toPaginatedListDto(
		paginationMessages: CursorPaginationResult<ChatMessageListItemResponseDto>,
	): ChatMessagePaginatedListResponseDto {
		return plainToInstance(
			ChatMessagePaginatedListResponseDto,
			paginationMessages,
			{ excludeExtraneousValues: true },
		);
	}

	toCountDto(count: number): ChatMessageCountResponseDto {
		return plainToInstance(
			ChatMessageCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}
}
