export type UserFeedParams =
	| {
			feedParams: {
				userId: string;
				feed: boolean;
			};
	  }
	| {
			feedParams?: never;
	  };
