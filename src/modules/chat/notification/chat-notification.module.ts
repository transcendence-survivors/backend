import { Module } from '@nestjs/common';
import { ChatNotificationRepository } from './repositories/chat-notification.repository';
import { ChatNotificationService } from './services/chat-notification.service';
import { ChatNotificationController } from './controller/chat-notification.controller';
import { ChatNotificationMapper } from './mappers/chat-notification.mapper';

@Module({
	controllers: [ChatNotificationController],
	providers: [
		ChatNotificationService,
		ChatNotificationRepository,
		ChatNotificationMapper,
	],
	exports: [ChatNotificationService, ChatNotificationMapper],
})
export class ChatNotificationModule {}
