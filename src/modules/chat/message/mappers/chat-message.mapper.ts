import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChatMessageListItemResponseDto } from '../dtos/responses/chat-message-list-item-response.dto';
import { ChatMessageListItem } from '../types/records/chat-message-list-item';
import { ChatMessagePaginatedListResponseDto } from '../dtos/responses/chat-message-paginated-list-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { ChatMessageCountResponseDto } from '../dtos/responses/chat-message-count-response.dto';
import { ChatMessageSoftDeletedResponseDto } from '../dtos/responses/chat-message-soft-deleted-response.dto';
import { ChatTypingUpdatePayload } from '../../types/records/chat-typing-update.type';
import { ChatTypingUpdateResponseDto } from '../dtos/responses/chat-typing-update-response.dto';

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

	toSoftDeletedDto(
		messageId: string,
		roomId: string,
	): ChatMessageSoftDeletedResponseDto {
		return plainToInstance(
			ChatMessageSoftDeletedResponseDto,
			{
				messageId,
				roomId,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toTypingUpdateDto(
		payload: ChatTypingUpdatePayload,
	): ChatTypingUpdateResponseDto {
		return plainToInstance(
			ChatTypingUpdateResponseDto,
			{
				roomId: payload.roomId,
				userId: payload.userId,
				isTyping: payload.isTyping,
				displayName: payload.displayName,
			},
			{ excludeExtraneousValues: true },
		);
	}
}
