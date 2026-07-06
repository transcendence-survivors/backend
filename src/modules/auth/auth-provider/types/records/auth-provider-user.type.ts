import { User } from '@prisma-generated/client';

export type AuthProviderUser = Pick<
	User,
	'id' | 'email' | 'username' | 'role' | 'displayName'
>;
