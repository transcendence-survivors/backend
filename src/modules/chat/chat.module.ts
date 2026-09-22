import { Module } from '@nestjs/common';
import { ChatRoomModule } from './room/chat-room.module';
import { ChatMemberModule } from './member/chat-member.module';
import { ChatMessageModule } from './message/chat-message.module';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatEventListener } from './listeners/chat.listener';
import { ChatBroadcaster } from './broadcasters/chat.broadcaster';
import { PresenceModule } from '../presence/presence.module';
import { ChatNotificationModule } from './notification/chat-notification.module';

@Module({
	imports: [
		ChatRoomModule,
		ChatMemberModule,
		ChatMessageModule,
		ChatNotificationModule,
		PresenceModule,
	],
	providers: [ChatBroadcaster, ChatEventListener, ChatGateway],
})
export class ChatModule {}
