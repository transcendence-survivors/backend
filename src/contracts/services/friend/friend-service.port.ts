import { DbContext } from '@/core/database/uow/db-context';

export const FRIEND_SERVICE = Symbol('FRIEND_SERVICE');

export interface IFriendService {
	getAllFriendsIds(userId: string, ctx?: DbContext): Promise<string[]>;
}
