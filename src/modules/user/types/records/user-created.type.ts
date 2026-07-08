import { User } from '@prisma-generated/client';
import { UserListItem } from '../../../../contracts/types/user/user-list-item.type';

export type UserCreated = UserListItem & Pick<User, 'email' | 'role'>;
