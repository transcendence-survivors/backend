import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { Post } from '@prisma-generated/client';

/**
 * Minimal shape of a post referenced by another post
 * (the post being replied to, or the post being quoted).
 */
export type PostPreview = Pick<Post, 'content'> & {
	author: UserListItem;
};

/**
 * Raw shape returned by `PostRepository.postSelect`.
 * The mapper turns it into a `PostListItemResponseDto`.
 */
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
