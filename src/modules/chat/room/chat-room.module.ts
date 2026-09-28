import { Module } from '@nestjs/common';
import { ChatRoomController } from './controllers/chat-room.controller';
import { ChatRoomMapper } from './mappers/chat-room.mapper';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatRoomService } from './services/chat-room.service';
import { UserModule } from '@/modules/user/user.module';
import { ChatMemberModule } from '../member/chat-member.module';
import { ChatNotificationRepository } from '../notification/repositories/chat-notification.repository';
import { BlockModule } from '@/modules/relationship/block/block.module';
import { ChatNotificationModule } from '../notification/chat-notification.module';

@Module({
	imports: [
		UserModule,
		ChatMemberModule,
		BlockModule,
		ChatNotificationModule,
	],
	controllers: [ChatRoomController],
	providers: [
		ChatRoomService,
		ChatRoomRepository,
		ChatRoomMapper,
		ChatNotificationRepository,
	],
	exports: [ChatRoomMapper, ChatRoomService],
})
export class ChatRoomModule {}
