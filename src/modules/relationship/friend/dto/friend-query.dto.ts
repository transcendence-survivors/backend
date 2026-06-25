import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import { IsEnum, IsIn, IsOptional, IsString, Min } from 'class-validator';
import {
	FRIENDSHIP_ORDER_BY,
	type FriendShipOrderBy,
} from '../repositories/friend.repository';
import { FriendshipState } from '@prisma-generated/enums';

class FriendQueryDto {
	@IsPaginationLimit({})
	limit: number = 20;

	@IsPaginationPage()
	page: number = 1;

	@IsOptional()
	@IsIn(FRIENDSHIP_ORDER_BY)
	orderBy: FriendShipOrderBy = 'createdAsc';

	@IsEnum(FriendshipState)
	status!: FriendshipState;

	@IsOptional()
	@IsString()
	@Min(1)
	search?: string;
}

export { FriendQueryDto };
