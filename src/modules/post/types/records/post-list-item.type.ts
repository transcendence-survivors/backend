import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { Post } from '@prisma-generated/client';

export type PostPreview = Pick<Post, 'content'> & {
	author: UserListItem;
};

export type QuotedPostPreview = Pick<
	Post,
	'id' | 'content' | 'imageUrl' | 'createdAt'
> & {
	author: UserListItem;
	_count: {
		likes: number;
		replies: number;
		quotes: number;
	};
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
	quotedPost: QuotedPostPreview | null;
	_count: {
		likes: number;
		replies: number;
		quotes: number;
	};
};
