import { IsSearch } from '@/shared/decorators/cursor.decorators';

export class FriendCountDto {
	@IsSearch({})
	search?: string;
}
