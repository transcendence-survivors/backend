import {
	IsCursor,
	IsCursorLimit,
	IsSearch,
} from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional } from 'class-validator';
import { UserOrderByEnum } from '../../types/enums/user-order-by.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserPaginateDto {
	@ApiProperty({
		description: 'The maximum number of user to return',
		example: 20,
		type: Number,
	})
	@IsCursorLimit({})
	limit: number = 20;

	@ApiPropertyOptional({
		description: 'The cursor to start the pagination from',
		type: String,
	})
	@IsCursor()
	cursor?: string;

	@ApiPropertyOptional({
		description: 'The order in which to sort the results',
		enum: UserOrderByEnum,
		example: UserOrderByEnum['created-desc'],
	})
	@IsOptional()
	@IsEnum(UserOrderByEnum)
	orderBy: UserOrderByEnum = UserOrderByEnum['created-desc'];

	@IsOptional()
	@IsSearch({})
	search?: string;
}
