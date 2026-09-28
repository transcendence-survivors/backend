import { FriendshipState } from '@prisma-generated/enums';

export interface FriendshipRelationship {
	senderId: string;
	state: FriendshipState;
}
