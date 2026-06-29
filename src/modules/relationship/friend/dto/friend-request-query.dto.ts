import { IsIn, IsOptional, IsString } from 'class-validator';
import { FriendCursorBaseQueryDto } from './friend-base-query.dto';

class FriendRequestCursorQuery extends FriendCursorBaseQueryDto {
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
