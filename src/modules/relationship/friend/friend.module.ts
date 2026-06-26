import { Module } from '@nestjs/common';
import { FriendController } from './controllers/friend.controller';
import { FriendRequestController } from './controllers/friend-request.controller';
import { UserModule } from '@/modules/user/user.module';
import { FriendService } from './services/friend.service';
import { FriendRepository } from './repositories/friend.repository';
import { BlockModule } from '../block/block.module';
import { FriendListener } from './listeners/friend.listener';

@Module({
	imports: [UserModule, BlockModule],
	controllers: [FriendController, FriendRequestController],
	providers: [FriendService, FriendRepository, FriendListener],
})
export class FriendModule {}
