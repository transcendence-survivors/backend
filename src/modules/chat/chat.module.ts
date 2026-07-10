import { Module } from '@nestjs/common';
import { ChatRoomModule } from './room/chat-room.module';
import { ChatMemberModule } from './members/chat-member.module';

@Module({
	imports: [ChatRoomModule, ChatMemberModule],
})
export class ChatModule {}
