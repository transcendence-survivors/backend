import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserCountDto } from './user-count.dto';
import { UserFeedEnum } from '../../types/enums/user-feed.enum';

export class UserFeedCountDto extends UserCountDto {
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
