import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { FriendshipState } from '@prisma-generated/enums';

export interface FriendShipListItem {
	id: string;
	status: FriendshipState;
	since: Date;
	friend: UserListItem;
}
