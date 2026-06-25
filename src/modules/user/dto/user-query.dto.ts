import { IsIn, IsOptional } from 'class-validator';
import { USER_ORDER_BY, type OrderBy } from '../repositories/user.repository';
import {
	IsPaginationLimit,
	IsPaginationPage,
} from '@/shared/decorators/pagination.decorators';

export class UserQueryDto {
	@IsPaginationPage()
	page: number = 1;

	@IsPaginationLimit({})
	limit: number = 20;

	@IsOptional()
	@IsIn(USER_ORDER_BY)
	orderBy?: OrderBy;
}
