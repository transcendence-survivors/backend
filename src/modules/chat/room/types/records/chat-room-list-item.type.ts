import { ChatRoom } from '@prisma-generated/client';

export type ChatRoomListItem = Pick<
	ChatRoom,
	'id' | 'name' | 'avatarUrl' | 'type' | 'updatedAt'
>;
