import { FriendshipState } from '@prisma-generated/client';
import { FriendShipBaseSelect } from '../records/friendship-base-select.type';

type FriendListItemParams = {
	state: Extract<FriendshipState, 'ACCEPTED'>;
	updatedAt: Date;
};
type FriendRequestListItemSelectParams = {
	state: Extract<FriendshipState, 'PENDING'>;
	createdAt: Date;
};

export type FriendShipListItemParams = Omit<FriendShipBaseSelect, 'state'> &
	(FriendListItemParams | FriendRequestListItemSelectParams);
