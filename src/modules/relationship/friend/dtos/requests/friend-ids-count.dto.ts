import { ArrayMaxSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { FriendIdsStatus } from '../../types/enums/friend-ids-status.enum';
import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FriendIdsCountDto {
	@ApiPropertyOptional({
		description: 'The search term to filter the results by',
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;

	@ApiProperty({
		description: 'The UUIDs of the friends to count',
		example: [
			'123e4567-e89b-12d3-a456-426614174000',
			'123e4567-e89b-12d3-a456-426614174001',
		],
		type: [String],
	})
	@IsArray()
	@ArrayMaxSize(10000)
	@IsUUID(undefined, { each: true })
	friendIds!: string[];

	@ApiProperty({
		description: 'The status of the friend IDs to count',
		enum: FriendIdsStatus,
		example: FriendIdsStatus.IN,
	})
	@IsEnum(FriendIdsStatus)
	status!: FriendIdsStatus;
}
