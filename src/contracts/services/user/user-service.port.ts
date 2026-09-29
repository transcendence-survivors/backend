import { DbContext } from '@/core/database/uow/db-context';
import { UserCreated } from '@/modules/user/types/records/user-created.type';
import { UserLocalePreference } from '@/modules/user/types/records/user-locale-preference.type';
import { AuhtUserData } from '@/contracts/types/user/user-token-data.type';
import { UserCreateParams } from '@/contracts/types/user/user-create.params';
import { UserListItem } from '@/modules/user/user.public-api';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
	createUserOrThrow(
		input: UserCreateParams,
		ctx?: DbContext,
	): Promise<UserCreated>;

	getAuthData(userId: string, ctx?: DbContext): Promise<AuhtUserData | null>;

	getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<UserLocalePreference | null>;

	validateUserId(userId: string, ctx?: DbContext): Promise<void>;
	delete(userId: string, ctx?: DbContext): Promise<void>;

	getCountIn(ids: string[], ctx?: DbContext): Promise<number>;

	getIdByUsername(username: string): Promise<string>;
	getItemByUsername(username: string, ctx?: DbContext): Promise<UserListItem>;
	getItemById(userId: string, ctx?: DbContext): Promise<UserListItem>;
}
