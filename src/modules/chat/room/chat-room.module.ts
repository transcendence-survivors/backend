import { Module } from '@nestjs/common';
import { ChatRoomController } from './controllers/chat-room.controller';
import { ChatRoomMapper } from './mappers/chat-room.mapper';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatRoomService } from './services/chat-room.service';
import { UserModule } from '@/modules/user/user.module';
import { ChatMemberModule } from '../members/chat-member.module';

@Module({
	imports: [UserModule, ChatMemberModule],
	controllers: [ChatRoomController],
	providers: [ChatRoomService, ChatRoomRepository, ChatRoomMapper],
})
export class ChatRoomModule {}
