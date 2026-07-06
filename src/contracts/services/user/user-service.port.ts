import { DbContext } from '@/core/database/uow/db-context';
import { UserCreated } from '@/modules/user/types/records/user-created.type';
import { UserLocalePreference } from '@/modules/user/types/records/user-locale-preference.type';
import { UserTokenData } from '@/contracts/types/user/user-token-data.type';
import { UserCreateParams } from '@/contracts/types/user/user-create.params';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
	createUserOrThrow(
		input: UserCreateParams,
		ctx?: DbContext,
	): Promise<UserCreated>;

	getTokenData(
		userId: string,
		ctx?: DbContext,
	): Promise<UserTokenData | null>;

	getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<UserLocalePreference | null>;

	validateUserId(userId: string, ctx?: DbContext): Promise<void>;
}
