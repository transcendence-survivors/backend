import { IsCursor, IsCursorLimit } from '@/shared/decorators/cursor.decorators';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserOrderByEnum } from '../../types/enums/user-order-by.enum';

export class UserPaginateDto {
	@IsCursorLimit({})
	limit: number = 20;

	@IsCursor()
	cursor?: string;

	@IsOptional()
	@IsEnum(UserOrderByEnum)
	orderBy: UserOrderByEnum = UserOrderByEnum['date-desc'];

	@IsOptional()
	@IsString()
	search?: string;
}
