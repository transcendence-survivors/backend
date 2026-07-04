import { ArrayMaxSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { FriendIdsStatus } from '../../types/enums/friend-ids-status.enum';
import { IsSearch } from '@/shared/decorators/cursor.decorators';

export class FriendIdsCountDto {
	@IsSearch({})
	search?: string;

	@IsArray()
	@ArrayMaxSize(10000)
	@IsUUID(undefined, { each: true })
	friendIds!: string[];

	@IsEnum(FriendIdsStatus)
	status!: FriendIdsStatus;
}
