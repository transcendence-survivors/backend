import { Module } from '@nestjs/common';
import { BlockModule } from './block/block.module';
import { FriendModule } from './friend/friend.module';
import { RelationshipController } from './controllers/relationship.controller';
import { RelationshipService } from './services/relationship.service';
import { RelationshipRepository } from './repositories/relationship.repository';
import { UserModule } from '../user/user.module';

@Module({
	imports: [BlockModule, FriendModule, UserModule],
	controllers: [RelationshipController],
	providers: [RelationshipService, RelationshipRepository],
})
export class RelationshipsModule {}
