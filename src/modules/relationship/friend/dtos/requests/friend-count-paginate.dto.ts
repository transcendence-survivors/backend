import { IsEnum, IsOptional } from 'class-validator';
import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { FriendRequestDirection } from '../../types/enums/friend-request-directions.enum';

export class FriendRequestCountDto {
	@IsSearch({})
	search?: string;

	@IsOptional()
	@IsEnum(FriendRequestDirection)
	direction: FriendRequestDirection = FriendRequestDirection.incoming;
}
