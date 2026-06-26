import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import {
	FRIENDSHIP_ORDER_BY,
	type FriendShipOrderBy,
} from '../repositories/friend.repository';

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
	@MinLength(1)
	search?: string;
}

export { FriendBaseQueryDto };
