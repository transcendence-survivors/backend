import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { ChatMessageListItem } from '@/modules/chat/message/types/records/chat-message-list-item';
import { ChatRoom } from '@prisma-generated/client';

type ChatRoomMemberSelect = {
	user: UserListItem;
};

export type ChatRoomListItem = Pick<
	ChatRoom,
	'id' | 'name' | 'avatarUrl' | 'type'
> & {
	members: ChatRoomMemberSelect[];
	messages: ChatMessageListItem[];
};
