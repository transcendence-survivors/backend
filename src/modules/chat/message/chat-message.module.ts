import { Module } from '@nestjs/common';
import { ChatMessageController } from './controller/chat-message.controller';
import { ChatMessageMapper } from './mappers/chat-message.mapper';
import { ChatMessageRepository } from './repositories/chat-message.repository';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMemberModule } from '../members/chat-member.module';

@Module({
	imports: [ChatMemberModule],
	controllers: [ChatMessageController],
	providers: [ChatMessageService, ChatMessageRepository, ChatMessageMapper],
	exports: [ChatMessageService, ChatMessageMapper],
})
export class ChatMessageModule {}
