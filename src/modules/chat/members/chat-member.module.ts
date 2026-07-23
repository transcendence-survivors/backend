import { Module } from '@nestjs/common';
import { ChatMemberController } from './controllers/chat-member.controller';
import { ChatMemberMapper } from './mappers/chat-member.mapper';
import { ChatMemberRepository } from './repositories/chat-member.repository';
import { ChatMemberService } from './services/chat-member.service';

@Module({
	controllers: [ChatMemberController],
	providers: [ChatMemberService, ChatMemberRepository, ChatMemberMapper],
	exports: [ChatMemberService, ChatMemberMapper],
})
export class ChatMemberModule {}
