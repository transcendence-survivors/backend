import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FriendCountDto {
	@ApiPropertyOptional({
		description: 'The search term to filter the results by',
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;
}
