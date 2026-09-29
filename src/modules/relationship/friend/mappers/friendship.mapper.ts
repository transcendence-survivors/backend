import { Injectable } from '@nestjs/common';
import { FriendshipCountResponseDto } from '../dtos/responses/friendship-count-response.dto';
import { plainToInstance } from 'class-transformer';
import { FriendShipListItemResponseDto } from '../dtos/responses/friendship-list-item-response.dto';
import { FriendShipListItem } from '../types/records/friendship-list-item.type';
import { CursorPaginationResult } from '@/shared/services/cursor.service';
import { FriendshipPaginatedResponseDto } from '../dtos/responses/friend-paginated-response.dto';
import { FriendRequestResponseDto } from '../dtos/responses/friend-request-response.dto';
import { UserListItem } from '@/modules/user/user.public-api';

@Injectable()
export class FriendshipMapper {
	toFriendRequestDto(sender: UserListItem): FriendRequestResponseDto {
		return plainToInstance(
			FriendRequestResponseDto,
			{
				user: sender,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toListItemDto(
		friendship: FriendShipListItem,
	): FriendShipListItemResponseDto {
		return plainToInstance(FriendShipListItemResponseDto, friendship, {
			excludeExtraneousValues: true,
		});
	}

	toCountDto(count: number): FriendshipCountResponseDto {
		return plainToInstance(
			FriendshipCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toPaginatedListDto(
		paginationFriendships: CursorPaginationResult<FriendShipListItemResponseDto>,
	): FriendshipPaginatedResponseDto {
		return plainToInstance(
			FriendshipPaginatedResponseDto,
			paginationFriendships,
			{ excludeExtraneousValues: true },
		);
	}

	toListItemDtoList(
		users: FriendShipListItem[],
	): FriendShipListItemResponseDto[] {
		return users.map((u) => this.toListItemDto(u));
	}
}
