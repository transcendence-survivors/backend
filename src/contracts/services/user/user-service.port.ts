import { DbContext } from '@/core/database/uow/db-context';
import UserCreateDto from '@/modules/user/dto/request/user-create.dto';
import { UserCreated } from '@/modules/user/types/records/user-created.type';
import { UserLocalePreference } from '@/modules/user/types/records/user-locale-preference.type';
import { UserTokenData } from '@/modules/user/types/records/user-token-data.type';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
	createUser(input: UserCreateDto, ctx?: DbContext): Promise<UserCreated>;

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
