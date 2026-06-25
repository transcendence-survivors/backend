import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';
import {
	IsEnum,
	IsIn,
	IsOptional,
	IsString,
	MinLength,
	ValidateIf,
} from 'class-validator';
import {
	FRIENDSHIP_ORDER_BY,
	type FriendShipOrderBy,
} from '../repositories/friend.repository';
import { FriendshipState } from '@prisma-generated/enums';

class FriendQueryDto {
	@IsPaginationLimit({})
	limit = 20;

	@IsPaginationPage()
	page = 1;

	@IsOptional()
	@IsIn(FRIENDSHIP_ORDER_BY)
	orderBy: FriendShipOrderBy = 'createdAsc';

	@IsEnum(FriendshipState)
	status!: FriendshipState;

	@ValidateIf((o: FriendQueryDto) => o.status === FriendshipState.PENDING)
	@IsIn(['incoming', 'outgoing'])
	request?: 'incoming' | 'outgoing';

	@IsOptional()
	@IsString()
	@MinLength(1)
	search?: string;
}

export { FriendQueryDto };
