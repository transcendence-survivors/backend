import { ChatMessage, User } from '@prisma-generated/client';

export type ChatMessageListItem = Pick<
	ChatMessage,
	| 'id'
	| 'content'
	| 'createdAt'
	| 'isEdited'
	| 'isDeleted'
	| 'replyToId'
	| 'attachmentUrls'
> & {
	sender: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
};
