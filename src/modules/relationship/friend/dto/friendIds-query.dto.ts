import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsUUID,
} from 'class-validator';
import { FriendCursorQueryDto } from './friend-base-query.dto';

enum FriendIdsQueryStatus {
	IN = 'IN',
	NOT_IN = 'NOT_IN',
}

class FriendIdsQueryDto extends FriendCursorQueryDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(10000)
	@IsUUID(undefined, { each: true })
	friendIds!: string[];

	@IsEnum(FriendIdsQueryStatus)
	status!: FriendIdsQueryStatus;
}

export { FriendIdsQueryDto, FriendIdsQueryStatus };
