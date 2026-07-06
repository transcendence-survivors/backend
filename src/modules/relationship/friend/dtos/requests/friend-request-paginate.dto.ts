import { IsEnum, IsOptional } from 'class-validator';
import { FriendBasePaginateDto } from './friend-base-paginate.dto';
import { FriendRequestDirection } from '../../types/enums/friend-request-directions.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FriendRequestPaginateDto extends FriendBasePaginateDto {
	@ApiPropertyOptional({
		description: 'The direction of the friend requests to paginate',
		enum: FriendRequestDirection,
		example: FriendRequestDirection.incoming,
	})
	@IsOptional()
	@IsEnum(FriendRequestDirection)
	direction: FriendRequestDirection = FriendRequestDirection.incoming;
}
