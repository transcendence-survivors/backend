import { UserListItem } from '@/modules/user/types/records/user-list-item.type';
import { FriendshipState } from '@prisma-generated/enums';

export interface FriendShipListItem {
	id: string;
	status: FriendshipState;
	since: Date;
	friend: UserListItem;
}
