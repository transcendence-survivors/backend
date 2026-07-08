import { User } from '@prisma-generated/client';
import { UserListItem } from '../../../../contracts/types/user/user-list-item.type';

export type UserProfileRecord = UserListItem &
	Pick<User, 'coverImageUrl' | 'bio'>;
