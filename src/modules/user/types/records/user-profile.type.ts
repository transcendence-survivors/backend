import { User } from '@prisma-generated/client';
import { UserListItem } from './user-list-item.type';

type UserProfileRecord = UserListItem & Pick<User, 'coverImageUrl' | 'bio'>;

export type { UserProfileRecord };
