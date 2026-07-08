import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserCountDto {
	@ApiPropertyOptional({
		description:
			"The search user's display name or username to filter the results by",
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;
}
