import { User } from '@prisma-generated/client';

export type UserTokenData = Pick<User, 'id' | 'username' | 'email' | 'role'>;
