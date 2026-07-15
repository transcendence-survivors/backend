import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { ChatMessage, ChatRoom, User } from '@prisma-generated/client';

type ChatRoomMemberSelect = {
	user: UserListItem;
};

type ChatRoomMessageSelect = Pick<ChatMessage, 'content' | 'createdAt'> & {
	sender: Pick<User, 'displayName'>;
};

export type ChatRoomListItem = Pick<
	ChatRoom,
	'id' | 'name' | 'avatarUrl' | 'type'
> & {
	members: ChatRoomMemberSelect[];
	messages: ChatRoomMessageSelect[];
};
