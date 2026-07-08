import { UserOrderByEnum } from '../enums/user-order-by.enum';
import { UserFeedParams } from './user-feed.params';

export type UsersCursorParams = {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: UserOrderByEnum;
} & UserFeedParams;
