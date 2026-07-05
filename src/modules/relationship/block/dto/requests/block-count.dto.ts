import { IsSearch } from '@/shared/decorators/cursor.decorators';

export class BlockCountDto {
	@IsSearch({})
	search?: string;
}
