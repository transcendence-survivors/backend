import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserListItemResponseDto } from '../dto/response/user-list-item-response.dto';
import { UserProfileResponseDto } from '../dto/response/user-profile.dto';
import { UserProfileRecord } from '../types/records/user-profile.type';
import { UserListItem } from '../types/records/user-list-item.type';
import { UserCountResponseDto } from '../dto/response/user-count-response.dto';
import { UserPaginatedListResponseDto } from '../dto/response/user-paginated-response.dto';
import { CursorPaginationResult } from '@/shared/services/cursor.service';

@Injectable()
export class UserMapper {
	toCountDto(count: number): UserCountResponseDto {
		return plainToInstance(
			UserCountResponseDto,
			{ count },
			{
				excludeExtraneousValues: true,
			},
		);
	}

	toPaginatedListDto(
		paginationUsers: CursorPaginationResult<UserListItemResponseDto>,
	): UserPaginatedListResponseDto {
		return plainToInstance(UserPaginatedListResponseDto, paginationUsers, {
			excludeExtraneousValues: true,
		});
	}

	toListItemDto(user: UserListItem): UserListItemResponseDto {
		return plainToInstance(UserListItemResponseDto, user, {
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
