import { Module } from '@nestjs/common';
import { FriendController } from './controllers/friend.controller';
import { UserModule } from '@/modules/user/user.module';
import { FriendService } from './services/friend.service';
import { FriendRepository } from './repositories/friend.repository';
import { BlockModule } from '../block/block.module';

@Module({
	imports: [UserModule, BlockModule],
	controllers: [FriendController],
	providers: [FriendService, FriendRepository],
})
export class FriendModule {}
