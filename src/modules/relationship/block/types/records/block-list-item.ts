import { UserListItem } from '@/contracts/types/user/user-list-item.type';

export type BlockedListItem = {
	id: string;
	since: Date;
	blocked: UserListItem;
};
