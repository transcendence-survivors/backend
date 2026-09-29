import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class FriendRequestResponseDto {
	@Type(() => UserListItemResponseDto)
	@Expose()
	user!: UserListItemResponseDto;
}
