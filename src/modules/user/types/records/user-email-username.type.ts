import { User } from '@prisma-generated/client';

export type UserEmailUsername = Pick<User, 'email' | 'username'>;
