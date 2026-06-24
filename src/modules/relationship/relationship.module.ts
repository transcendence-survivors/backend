import { Module } from '@nestjs/common';
import { BlockModule } from './block/block.module';
import { FriendModule } from './friend/friend.module';

@Module({
	imports: [BlockModule, FriendModule],
})
export class RelationshipsModule {}
