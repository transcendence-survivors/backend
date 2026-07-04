import { User } from '@prisma-generated/client';
import { UserListItem } from './user-list-item.type';

export type UserCreated = UserListItem & Pick<User, 'email' | 'role'>;
