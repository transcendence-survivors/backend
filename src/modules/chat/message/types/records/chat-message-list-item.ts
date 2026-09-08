import { ChatMemberRole, ChatMessage, User } from '@prisma-generated/client';

export type ChatMessageUserSummary = Pick<
	User,
	'id' | 'username' | 'displayName' | 'avatarUrl'
>;

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
	metadata: {
		oldRole: ChatMemberRole | null;
		newRole: ChatMemberRole | null;
		oldValue: string | null;
		newValue: string | null;
		targetUser: ChatMessageUserSummary | null;
	} | null;
};
