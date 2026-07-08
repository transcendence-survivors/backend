import { User } from '@prisma-generated/client';

export type UserListItem = Pick<
	User,
	'id' | 'username' | 'displayName' | 'avatarUrl'
>;
