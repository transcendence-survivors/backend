import { UserFeedEnum } from '../enums/user-feed.enum';

export type UserFeedParams =
	| {
			feedParams: {
				userId: string;
				feed: UserFeedEnum;
			};
	  }
	| {
			feedParams?: never;
	  };
