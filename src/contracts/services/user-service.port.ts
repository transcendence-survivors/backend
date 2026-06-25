import { DbContext } from '@/core/database/uow/db-context';
import CreateUserDto from '@/modules/user/dto/user-create.dto';
import { User } from '@prisma-generated/client';

export const USER_SERVICE = Symbol('USER_SERVICE');

type CreateUserResult = Pick<
	User,
	'id' | 'username' | 'email' | 'role' | 'displayName' | 'avatarUrl'
>;
type GetTokenDataResult = Pick<User, 'id' | 'username' | 'email' | 'role'>;
type GetIdByEmailResult = Pick<User, 'id' | 'localePreference'>;

export interface IUserService {
	createUser(
		input: CreateUserDto,
		ctx?: DbContext,
	): Promise<CreateUserResult>;

	getTokenData(
		userId: string,
		ctx?: DbContext,
	): Promise<GetTokenDataResult | null>;

	getLocalPreferenceByEmail(
		email: string,
		ctx?: DbContext,
	): Promise<GetIdByEmailResult | null>;
}
