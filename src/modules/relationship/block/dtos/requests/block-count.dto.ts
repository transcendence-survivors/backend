import { IsSearch } from '@/shared/decorators/cursor.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BlockCountDto {
	@ApiPropertyOptional({
		description: 'The username or display name to filter the results by',
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;
}
