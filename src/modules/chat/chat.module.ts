import { Module } from '@nestjs/common';
import { ChatRoomModule } from './room/chat-room.module';
import { ChatMemberModule } from './members/chat-member.module';
import { ChatMessageModule } from './message/chat-message.module';

@Module({
	imports: [ChatRoomModule, ChatMemberModule, ChatMessageModule],
})
export class ChatModule {}
