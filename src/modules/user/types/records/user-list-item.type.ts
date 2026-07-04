import { User } from '@prisma-generated/client';

type UserListItem = Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

export type { UserListItem };
