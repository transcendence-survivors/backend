import { Friendship } from '@prisma-generated/client';
import { FriendShipBaseSelect } from './friendship-base-select.type';

export type FriendRequestCreated = FriendShipBaseSelect &
	Pick<Friendship, 'createdAt'>;
