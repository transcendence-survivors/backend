import { Friendship } from '@prisma-generated/client';
import { FriendShipBaseSelect } from './friendship-base-select.type';

export type FriendShipListItemSelect = FriendShipBaseSelect &
	Pick<Friendship, 'createdAt' | 'updatedAt'>;
