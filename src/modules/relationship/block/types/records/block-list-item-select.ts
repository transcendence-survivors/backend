import { UserListItem } from '@/contracts/types/user/user-list-item.type';

export type BlockListItemSelect = {
	id: string;
	createdAt: Date;
	blocked: UserListItem;
};
