import { Friendship } from '@prisma-generated/browser';

export type FriendShipFind = Pick<Friendship, 'id' | 'senderId' | 'state'>;
