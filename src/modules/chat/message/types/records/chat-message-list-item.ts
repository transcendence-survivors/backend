import {
	ChatMemberRole,
	ChatMessage,
	Post,
	User,
} from '@prisma-generated/client';

type ChatMessageUserSummary = Pick<
	User,
	'id' | 'username' | 'displayName' | 'avatarUrl'
> & {
	chatMemberships: {
		role: ChatMemberRole;
	}[];
};

type SharedPost = Pick<
	Post,
	'id' | 'content' | 'imageUrl' | 'type' | 'createdAt'
> & {
	author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
};

export type ChatMessageListItem = Pick<
	ChatMessage,
	| 'id'
	| 'roomId'
	| 'type'
	| 'content'
	| 'createdAt'
	| 'isEdited'
	| 'isDeleted'
	| 'replyToId'
	| 'attachmentUrls'
> & {
	sender: ChatMessageUserSummary | null;
	sharedPost: SharedPost | null;
	metadata: {
		oldRole: ChatMemberRole | null;
		newRole: ChatMemberRole | null;
		oldValue: string | null;
		newValue: string | null;
		targetUser: ChatMessageUserSummary | null;
	} | null;
};
