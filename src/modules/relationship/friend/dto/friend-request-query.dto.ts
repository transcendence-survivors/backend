import { IsIn, IsOptional } from 'class-validator';
import { FriendBaseQueryDto } from './friend-base-query.dto';

class FriendRequestQueryDto extends FriendBaseQueryDto {
	@IsOptional()
	@IsIn(['incoming', 'outgoing'])
	direction: 'incoming' | 'outgoing' = 'incoming';
}

export { FriendRequestQueryDto };
