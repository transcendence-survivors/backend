import { FriendshipState } from '@prisma-generated/enums';
import { FriendRequestDirection } from '../enums/friend-request-directions.enum';

interface FriendShipPendingDirection {
	status: Extract<FriendshipState, 'PENDING'>;
	direction: FriendRequestDirection;
}

interface FriendShipAcceptedDirection {
	status: Extract<FriendshipState, 'ACCEPTED'>;
	direction?: never;
}

export type FriendShipStatusDirectionParams =
	| FriendShipPendingDirection
	| FriendShipAcceptedDirection;
