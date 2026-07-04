import { UserOrderByEnum } from '../enums/user-order-by.enum';

export interface UsersCursorParams {
	userId?: string;
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: UserOrderByEnum;
}
