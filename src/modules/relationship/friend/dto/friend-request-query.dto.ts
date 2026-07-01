import { IsIn, IsOptional, IsString } from 'class-validator';
import { FriendCursorQueryDto } from './friend-base-query.dto';

class FriendRequestCursorQuery extends FriendCursorQueryDto {
	@IsOptional()
	@IsIn(['incoming', 'outgoing'])
	direction: 'incoming' | 'outgoing' = 'incoming';
}

class FriendRequestCountQuery {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsIn(['incoming', 'outgoing'])
	direction: 'incoming' | 'outgoing' = 'incoming';
}

export { FriendRequestCursorQuery, FriendRequestCountQuery };
