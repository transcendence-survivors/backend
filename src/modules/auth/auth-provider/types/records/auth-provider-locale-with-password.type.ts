import { AuthProvider } from '@prisma-generated/browser';
import { AuthProviderUser } from './auth-provider-user.type';

export type AuthProviderLocaleWithPassword = Pick<
	AuthProvider,
	'userId' | 'password'
> & {
	user: AuthProviderUser;
};
