import { Injectable } from '@nestjs/common';
import { ChatMemberListItem } from '../types/records/chat-member-list-item';
import { ChatMemberListItemResponseDto } from '../dtos/responses/chat-member-list-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { ChatMemberCountResponseDto } from '../dtos/responses/chat-member-count-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { ChatMemberPaginatedListResponseDto } from '../dtos/responses/chat-member-paginated-list-response.dto';
import { ChatMemberRemovedResponseDto } from '../dtos/responses/chat-member-removed-response.dto';
import { ChatMemberRole } from '@prisma-generated/enums';
import { ChatMemberRoleUpdatedResponseDto } from '../dtos/responses/chat-member-role-updated-response.dto';
import { ChatMemberAddedResponseDto } from '../dtos/responses/chat-member-added-response.dto';

@Injectable()
export class ChatMemberMapper {
	toListItemDto(record: ChatMemberListItem): ChatMemberListItemResponseDto {
		return plainToInstance(ChatMemberListItemResponseDto, record, {
			excludeExtraneousValues: true,
		});
	}

	toListItemDtoList(
		records: ChatMemberListItem[],
	): ChatMemberListItemResponseDto[] {
		return records.map((record) => this.toListItemDto(record));
	}

	toPaginatedListDto(
		pagination: CursorPaginationResult<ChatMemberListItemResponseDto>,
	): ChatMemberPaginatedListResponseDto {
		return plainToInstance(ChatMemberPaginatedListResponseDto, pagination, {
			excludeExtraneousValues: true,
		});
	}

	toCountDto(count: number): ChatMemberCountResponseDto {
		return plainToInstance(
			ChatMemberCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toAddedDto(roomId: string, userId: string): ChatMemberAddedResponseDto {
		return plainToInstance(
			ChatMemberAddedResponseDto,
			{
				roomId,
				userId,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toRemovedDto(roomId: string, userId: string): ChatMemberRemovedResponseDto {
		return plainToInstance(
			ChatMemberRemovedResponseDto,
			{
				roomId,
				userId,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toRoleUpdatedDto(
		roomId: string,
		targetUserId: string,
		newRole: ChatMemberRole,
	): ChatMemberRoleUpdatedResponseDto {
		return plainToInstance(
			ChatMemberRoleUpdatedResponseDto,
			{
				roomId,
				targetUserId,
				newRole,
			},
			{ excludeExtraneousValues: true },
		);
	}
}
