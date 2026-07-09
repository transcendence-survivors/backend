import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { PresenceStatusEnum } from '../enums/presence-status.enum';
import { PresenceFriend } from './presence-friend.type';

export type PresenceConnect = {
	rooms: string[];
	activeFriends: PresenceFriend[];
	onlineCount: number;
	isFirstConnection: boolean;
	user: UserListItem;
	status: PresenceStatusEnum;
};
