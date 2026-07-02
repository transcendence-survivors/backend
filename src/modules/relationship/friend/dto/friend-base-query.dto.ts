import { IsPaginationLimit } from '@/shared/decorators/pagination.decorators';
import { IsIn, IsOptional, IsString } from 'class-validator';

const FRIENDSHIP_ORDER_BY = [
	'createdAsc',
	'createdDesc',
	'updatedAsc',
	'updatedDesc',
	'userNameAsc',
	'userNameDesc',
] as const;
type FriendShipOrderBy = (typeof FRIENDSHIP_ORDER_BY)[number];

class FriendCursorQueryDto {
	@IsPaginationLimit({})
	limit = 20;

	@IsOptional()
	@IsString()
	cursor?: string;

	@IsOptional()
	@IsIn(FRIENDSHIP_ORDER_BY)
	orderBy: FriendShipOrderBy = 'createdAsc';

	@IsOptional()
	@IsString()
	search?: string;
}

export { FriendCursorQueryDto, FRIENDSHIP_ORDER_BY };
export type { FriendShipOrderBy };
