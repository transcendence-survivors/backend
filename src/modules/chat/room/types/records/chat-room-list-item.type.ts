import {
	ChatMember,
	ChatMessage,
	ChatRoom,
	User,
} from '@prisma-generated/client';

type ChatRoomMemberSelect = Pick<ChatMember, 'userId' | 'role'> & {
	user: Pick<User, 'displayName' | 'avatarUrl'>;
};

type ChatRoomMessageSelect = Pick<ChatMessage, 'content' | 'createdAt'> & {
	sender: Pick<User, 'displayName'>;
};

export type ChatRoomListItem = Pick<
	ChatRoom,
	'id' | 'name' | 'avatarUrl' | 'type' | 'updatedAt'
> & {
	members: ChatRoomMemberSelect[];
	messages: ChatRoomMessageSelect[];
};
