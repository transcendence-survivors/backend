import { IsEnum, IsOptional } from 'class-validator';
import { FriendBasePaginateDto } from './friend-base-paginate.dto';
import { FriendRequestDirection } from '../../types/enums/friend-request-directions.enum';

export class FriendRequestPaginateDto extends FriendBasePaginateDto {
	@IsOptional()
	@IsEnum(FriendRequestDirection)
	direction: FriendRequestDirection = FriendRequestDirection.incoming;
}
