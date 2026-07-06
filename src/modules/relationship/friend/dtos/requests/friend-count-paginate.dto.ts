import { IsEnum, IsOptional } from 'class-validator';
import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { FriendRequestDirection } from '../../types/enums/friend-request-directions.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FriendRequestCountDto {
	@ApiPropertyOptional({
		description: 'The search term to filter the results by',
		example: 'john',
		type: String,
	})
	@IsOptional()
	@IsSearch({})
	search?: string;

	@ApiPropertyOptional({
		description: 'The direction of the friend requests to count',
		enum: FriendRequestDirection,
		example: FriendRequestDirection.incoming,
	})
	@IsOptional()
	@IsEnum(FriendRequestDirection)
	direction: FriendRequestDirection = FriendRequestDirection.incoming;
}
