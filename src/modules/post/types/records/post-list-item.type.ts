import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { Post } from '@prisma-generated/client';

export type PostPreview = Pick<Post, 'content'> & {
	author: UserListItem;
};

export type PostListItem = Pick<
	Post,
	| 'id'
	| 'content'
	| 'imageUrl'
	| 'createdAt'
	| 'parentPostId'
	| 'quotedPostId'
> & {
	author: UserListItem;
	parent: PostPreview | null;
	quotedPost: PostPreview | null;
	_count: {
		likes: number;
		replies: number;
		reposts: number;
	};
};
