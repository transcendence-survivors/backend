import { FriendshipState } from '@prisma-generated/enums';

export type FriendShipDeleteParams = {
	userId: string;
	friendId: string;
	status?: FriendshipState;
};
