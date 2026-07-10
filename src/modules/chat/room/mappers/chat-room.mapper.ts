import { Injectable } from '@nestjs/common';
import { ChatRoomListItem } from '../types/records/chat-room-list-item.type';
import { ChatRoomListItemResponseDto } from '../dtos/responses/chat-room-list-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { ChatRoomCountResponseDto } from '../dtos/responses/chat-room-count-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { ChatRoomPaginatedListResponseDto } from '../dtos/responses/chat-room-paginated-list-response.dto';

@Injectable()
export class ChatRoomMapper {
	toListItemDto(room: ChatRoomListItem): ChatRoomListItemResponseDto {
		return plainToInstance(ChatRoomListItemResponseDto, room, {
			excludeExtraneousValues: true,
		});
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
