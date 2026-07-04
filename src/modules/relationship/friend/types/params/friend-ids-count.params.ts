import { FriendIdsStatus } from '../enums/friend-ids-status.enum';

export type FriendIdsCountParams = {
	userId: string;
	search?: string;
	friendIds: string[];
	status: FriendIdsStatus;
};
