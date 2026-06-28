import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import { IsIn, IsOptional, IsString } from 'class-validator';

const FRIENDSHIP_ORDER_BY = ['createdAsc', 'createdDesc'] as const;
type FriendShipOrderBy = (typeof FRIENDSHIP_ORDER_BY)[number];

class FriendBaseQueryDto {
	@IsPaginationLimit({})
	limit = 20;

	@IsPaginationPage()
	page = 1;

	@IsOptional()
	@IsIn(FRIENDSHIP_ORDER_BY)
	orderBy: FriendShipOrderBy = 'createdAsc';

	@IsOptional()
	@IsString()
	search?: string;
}

class FriendCursorBaseQueryDto {
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

export { FriendBaseQueryDto, FriendCursorBaseQueryDto, FRIENDSHIP_ORDER_BY };
export type { FriendShipOrderBy };
