import { Module } from '@nestjs/common';
import { ChatMessageController } from './controller/chat-message.controller';
import { ChatMessageMapper } from './mappers/chat-message.mapper';
import { ChatMessageRepository } from './repositories/chat-message.repository';
import { ChatMessageService } from './services/chat-message.service';

@Module({
	controllers: [ChatMessageController],
	providers: [ChatMessageService, ChatMessageRepository, ChatMessageMapper],
})
export class ChatMessageModule {}
