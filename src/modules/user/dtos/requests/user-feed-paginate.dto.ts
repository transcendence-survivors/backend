import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserPaginateDto } from './user-paginate.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserFeedEnum } from '../../types/enums/user-feed.enum';

export class UserFeedPaginateDto extends UserPaginateDto {
	@ApiPropertyOptional({
		description: 'Which feed to filter users by',
		enum: UserFeedEnum,
		example: UserFeedEnum.FRIENDS,
		default: UserFeedEnum.FRIENDS,
	})
	@IsOptional()
	@IsEnum(UserFeedEnum)
	feed: UserFeedEnum = UserFeedEnum.FRIENDS;
}
