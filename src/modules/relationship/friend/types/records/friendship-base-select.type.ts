import { UserListItem } from '@/modules/user/types/records/user-list-item.type';
import { Friendship } from '@prisma-generated/client';

export type FriendShipBaseSelect = Pick<Friendship, 'id' | 'state'> & {
	userA: UserListItem;
	userB: UserListItem;
};
