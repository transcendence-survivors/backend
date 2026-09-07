import { ChatMember, User } from '@prisma-generated/client';

export type ChatMemberListItem = Pick<
	ChatMember,
	'id' | 'roomId' | 'role' | 'joinedAt'
> & {
	user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
};
