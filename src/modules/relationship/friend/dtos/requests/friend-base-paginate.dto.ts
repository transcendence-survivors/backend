import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { FriendShipOrderByEnum } from '../../types/enums/friend-order-by.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FriendBasePaginateDto {
	@ApiProperty({
		description: 'The maximum number of items to return',
		example: 20,
		type: Number,
	})
	@IsCursorLimit({})
	limit = 20;

	@ApiPropertyOptional({
		description: 'The cursor to start the pagination from',
		type: String,
	})
	@IsOptional()
	@IsCursor()
	cursor?: string;

	@ApiPropertyOptional({
		description: 'The order in which to sort the results',
		enum: FriendShipOrderByEnum,
		example: FriendShipOrderByEnum['created-desc'],
	})
	@IsOptional()
	@IsEnum(FriendShipOrderByEnum)
	orderBy: FriendShipOrderByEnum = FriendShipOrderByEnum['created-desc'];

	@ApiPropertyOptional({
		description: 'The search term to filter the results by',
		example: 'john',
		type: String,
	})
	@IsSearch({})
	search?: string;
}
