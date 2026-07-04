import { User } from '@prisma-generated/client';

export type UserLocalePreference = Pick<User, 'localePreference' | 'id'>;
