import { UserFeedParams } from './user-feed.params';

export type UsersCountParams = {
	search?: string;
} & UserFeedParams;
