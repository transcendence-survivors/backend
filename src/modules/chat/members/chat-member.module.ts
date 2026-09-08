import { Module } from '@nestjs/common';
import { ChatMemberController } from './controllers/chat-member.controller';
import { ChatMemberMapper } from './mappers/chat-member.mapper';
import { ChatMemberRepository } from './repositories/chat-member.repository';
import { ChatMemberService } from './services/chat-member.service';
import { ChatRoomMembershipGuard } from './guards/chat-room-membership.guard';
import { ChatMemberPermissionService } from './services/chat-member-permission.service';

@Module({
	controllers: [ChatMemberController],
	providers: [
		ChatMemberService,
		ChatMemberRepository,
		ChatMemberMapper,
		ChatRoomMembershipGuard,
		ChatMemberPermissionService,
	],
	exports: [ChatMemberService, ChatRoomMembershipGuard],
})
export class ChatMemberModule {}
