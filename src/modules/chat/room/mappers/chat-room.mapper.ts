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
	toListItemDto(
		room: ChatRoomListItem,
		memberIds: string[],
	): ChatRoomListItemResponseDto {
		const otherMembers = room.members.map((m) => m.user);
		const isDirect = room.type === ChatRoomType.DIRECT;

		return plainToInstance(ChatRoomListItemResponseDto, {
			id: room.id,
			type: room.type,
			name: room.name,
			avatarUrl: room.avatarUrl,
			lastMessage: room.messages[0] ?? null,
			otherMember: isDirect ? otherMembers[0] : undefined,
			membersPreview: isDirect ? undefined : otherMembers,
			memberIds: isDirect ? undefined : memberIds,
			memberCount: isDirect ? undefined : memberIds.length,
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
		chatRooms: ChatRoomListItem[],
		memberIdsByRoom: Record<string, string[]>,
	): ChatRoomListItemResponseDto[] {
		return chatRooms.map((room) =>
			this.toListItemDto(room, memberIdsByRoom[room.id] ?? []),
		);
	}
}
