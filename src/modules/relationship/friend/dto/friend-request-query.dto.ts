import { IsIn, IsOptional } from 'class-validator';
import {
	FriendBaseQueryDto,
	FriendCursorBaseQueryDto,
} from './friend-base-query.dto';

class FriendRequestQueryDto extends FriendBaseQueryDto {
	@IsOptional()
	@IsIn(['incoming', 'outgoing'])
	direction: 'incoming' | 'outgoing' = 'incoming';
}

class FriendRequestCursorQuery extends FriendCursorBaseQueryDto {
	@IsOptional()
	@IsIn(['incoming', 'outgoing'])
	direction: 'incoming' | 'outgoing' = 'incoming';
}

export { FriendRequestQueryDto, FriendRequestCursorQuery };
