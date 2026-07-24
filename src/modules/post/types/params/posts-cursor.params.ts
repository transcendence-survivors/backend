import { PostOrderByEnum } from '../enums/post-order-by.enum';

export interface PostsCursorParams {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: PostOrderByEnum;
}

export interface PostsFeedCursorParams extends PostsCursorParams {
	parentPostId: string | null;
	excludeUserId?: string;
}

export interface PostsByAuthorCursorParams extends PostsCursorParams {
	authorId: string;
}

export interface PostsLikedByCursorParams extends PostsCursorParams {
	userId: string;
}
