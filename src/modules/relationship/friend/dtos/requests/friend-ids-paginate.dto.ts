import { ArrayMaxSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { FriendBasePaginateDto } from './friend-base-paginate.dto';
import { FriendIdsStatus } from '../../types/enums/friend-ids-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FriendIdsPaginateDto extends FriendBasePaginateDto {
	@ApiProperty({
		description: 'The UUIDs of the friends to paginate',
		example: [
			'123e4567-e89b-12d3-a456-426614174000',
			'123e4567-e89b-12d3-a456-426614174001',
		],
	})
	@IsArray()
	@ArrayMaxSize(10000)
	@IsUUID(undefined, { each: true })
	friendIds!: string[];

	@ApiProperty({
		description: 'The status of the friend IDs to paginate',
		enum: FriendIdsStatus,
		example: FriendIdsStatus.IN,
	})
	@IsEnum(FriendIdsStatus)
	status!: FriendIdsStatus;
}
