import { IsOptional, IsString } from 'class-validator';
import { FriendCursorQueryDto } from './friend-base-query.dto';

class FriendQueryDto extends FriendCursorQueryDto {}

class FriendCountQueryDto {
	@IsOptional()
	@IsString()
	search?: string;
}

export { FriendQueryDto, FriendCountQueryDto };
