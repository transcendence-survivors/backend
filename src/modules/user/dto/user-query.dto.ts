import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { USER_ORDER_BY, type OrderBy } from '../repositories/user.repository';

export class UserQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit: number = 20;

	@IsOptional()
	@IsIn(USER_ORDER_BY)
	orderBy?: OrderBy;
}
