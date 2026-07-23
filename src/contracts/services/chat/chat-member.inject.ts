import { Inject } from '@nestjs/common';
import { CHAT_MEMBER_SERVICE } from './chat-member.port';

export const InjectChatMemberService = () => Inject(CHAT_MEMBER_SERVICE);
