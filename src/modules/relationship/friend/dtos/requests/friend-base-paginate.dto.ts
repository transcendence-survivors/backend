import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { FriendShipOrderByEnum } from '../../types/enums/friend-order-by.enum';

export class FriendBasePaginateDto {
	@IsCursorLimit({})
	limit = 20;

	@IsCursor()
	cursor?: string;

	@IsOptional()
	@IsEnum(FriendShipOrderByEnum)
	orderBy: FriendShipOrderByEnum = FriendShipOrderByEnum['created-desc'];

	@IsSearch({})
	search?: string;
}
