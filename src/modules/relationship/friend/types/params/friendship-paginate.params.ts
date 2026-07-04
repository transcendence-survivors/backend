import { FriendShipOrderByEnum } from '../enums/friend-order-by.enum';
import { FriendShipStatusDirectionParams } from './friendship-status-direction.params';

export type FriendShipsPaginateParams = {
	limit: number;
	cursor?: string;
	orderBy: FriendShipOrderByEnum;
	search?: string;
	userId: string;
} & FriendShipStatusDirectionParams;
