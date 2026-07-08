import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserListItemResponseDto } from '../dtos/responses/user-list-item-response.dto';
import { UserProfileResponseDto } from '../dtos/responses/user-profile.dto';
import { UserProfileRecord } from '../types/records/user-profile.type';
import { UserListItem } from '../../../contracts/types/user/user-list-item.type';
import { UserCountResponseDto } from '../dtos/responses/user-count-response.dto';
import { UserPaginatedListResponseDto } from '../dtos/responses/user-paginated-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';

@Injectable()
export class UserMapper {
	private toListItemDto(user: UserListItem): UserListItemResponseDto {
		return plainToInstance(UserListItemResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}

	toCountDto(count: number): UserCountResponseDto {
		return plainToInstance(
			UserCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toPaginatedListDto(
		paginationUsers: CursorPaginationResult<UserListItemResponseDto>,
	): UserPaginatedListResponseDto {
		return plainToInstance(UserPaginatedListResponseDto, paginationUsers, {
			excludeExtraneousValues: true,
		});
	}

	toListItemDtoList(users: UserListItem[]): UserListItemResponseDto[] {
		return users.map((u) => this.toListItemDto(u));
	}

	toProfileDto(user: UserProfileRecord): UserProfileResponseDto {
		return plainToInstance(UserProfileResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}
}
