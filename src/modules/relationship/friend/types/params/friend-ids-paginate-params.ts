import { FriendIdsStatus } from '../enums/friend-ids-status.enum';
import { FriendShipOrderByEnum } from '../enums/friend-order-by.enum';

export interface FriendIdsPaginateParams {
	userId: string;
	limit: number;
	cursor?: string;
	friendIds: string[];
	status: FriendIdsStatus;
	orderBy: FriendShipOrderByEnum;
	search?: string;
}
