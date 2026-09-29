import { Module } from '@nestjs/common';
import { FriendController } from './controllers/friend.controller';
import { FriendRequestController } from './controllers/friend-request.controller';
import { UserModule } from '@/modules/user/user.module';
import { FriendService } from './services/friend.service';
import { FriendRepository } from './repositories/friend.repository';
import { BlockModule } from '../block/block.module';
import { FriendListener } from './listeners/friend.listener';
import { FriendshipMapper } from './mappers/friendship.mapper';
import { FRIEND_SERVICE } from '@/contracts/services/friend/friend-service.port';
import { FriendBroadcaster } from './broadcaster/friend.broadcaster';
import { PresenceModule } from '@/modules/presence/presence.module';

@Module({
	imports: [UserModule, BlockModule, PresenceModule],
	controllers: [FriendController, FriendRequestController],
	providers: [
		FriendService,
		FriendRepository,
		FriendListener,
		FriendshipMapper,
		FriendBroadcaster,
		{
			provide: FRIEND_SERVICE,
			useExisting: FriendService,
		},
	],
	exports: [FRIEND_SERVICE],
})
export class FriendModule {}
