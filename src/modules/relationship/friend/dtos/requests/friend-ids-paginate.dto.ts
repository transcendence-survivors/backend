import { ArrayMaxSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { FriendBasePaginateDto } from './friend-base-paginate.dto';
import { FriendIdsStatus } from '../../types/enums/friend-ids-status.enum';

export class FriendIdsPaginateDto extends FriendBasePaginateDto {
	@IsArray()
	@ArrayMaxSize(10000)
	@IsUUID(undefined, { each: true })
	friendIds!: string[];

	@IsEnum(FriendIdsStatus)
	status!: FriendIdsStatus;
}
