import { User } from '@prisma-generated/client';

export type AuhtUserData = Pick<
	User,
	'id' | 'username' | 'email' | 'role' | 'displayName' | 'avatarUrl'
>;
