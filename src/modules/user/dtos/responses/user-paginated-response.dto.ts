import { ApiProperty } from '@nestjs/swagger';
import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { UserListItemResponseDto } from './user-list-item-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserPaginatedListResponseDto extends CursorPaginationResultDto<UserListItemResponseDto> {
	@ApiProperty({
		type: [UserListItemResponseDto],
		description: 'List of users',
	})
	@Expose()
	@Type(() => UserListItemResponseDto)
	declare data: UserListItemResponseDto[];
}
