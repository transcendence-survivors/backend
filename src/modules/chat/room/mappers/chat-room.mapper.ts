import { Injectable } from '@nestjs/common';
import { ChatRoomListItem } from '../types/records/chat-room-list-item.type';
import { ChatRoomListItemResponseDto } from '../dtos/responses/chat-room-list-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { ChatRoomCountResponseDto } from '../dtos/responses/chat-room-count-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { ChatRoomPaginatedListResponseDto } from '../dtos/responses/chat-room-paginated-list-response.dto';
import { ChatRoomType } from '@prisma-generated/enums';

@Injectable()
export class ChatRoomMapper {
	toListItemDto(room: ChatRoomListItem): ChatRoomListItemResponseDto {
		const [lastMessageRaw] = room.messages;
		const [memberRaw] = room.members;

		return plainToInstance(
			ChatRoomListItemResponseDto,
			{
				id: room.id,
				type: room.type,
				name: room.name,
				avatarUrl: room.avatarUrl,
				lastMessage: lastMessageRaw
					? {
							content: lastMessageRaw.content,
							createdAt: lastMessageRaw.createdAt,
							senderDisplayName:
								lastMessageRaw.sender.displayName,
						}
					: null,
				otherMember:
					room.type === ChatRoomType.DIRECT && memberRaw
						? memberRaw.user
						: undefined,
			},
			{
				excludeExtraneousValues: true,
			},
		);
	}

	toCountDto(count: number): ChatRoomCountResponseDto {
		return plainToInstance(
			ChatRoomCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toPaginatedListDto(
		paginationUsers: CursorPaginationResult<ChatRoomListItemResponseDto>,
	): ChatRoomPaginatedListResponseDto {
		return plainToInstance(
			ChatRoomPaginatedListResponseDto,
			paginationUsers,
			{
				excludeExtraneousValues: true,
			},
		);
	}

	toListItemDtoList(
		rooms: ChatRoomListItem[],
	): ChatRoomListItemResponseDto[] {
		return rooms.map((r) => this.toListItemDto(r));
	}
}
