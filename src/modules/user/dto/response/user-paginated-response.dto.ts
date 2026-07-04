import { ApiProperty } from '@nestjs/swagger';
import { CursorPaginationResultDto } from '@/shared/dto/cursor-pagination-result.dto';
import { UserListItemResponseDto } from './user-list-item-response.dto';
import { Expose, Type } from 'class-transformer';

export class UserPaginatedListResponseDto extends CursorPaginationResultDto<UserListItemResponseDto> {
	@ApiProperty({ type: [UserListItemResponseDto] })
	@Expose()
	@Type(() => UserListItemResponseDto)
	declare data: UserListItemResponseDto[];
}
