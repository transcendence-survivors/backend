import { ChatMemberFindParams } from '@/modules/chat/members/types/params/chat-member-find.params';
import { ChatMember } from '@prisma-generated/client';

export const CHAT_MEMBER_SERVICE = Symbol('CHAT_MEMBER_SERVICE');

export interface IChatMemberService {
	findByRoomAndUser(params: ChatMemberFindParams): Promise<ChatMember | null>;
}
