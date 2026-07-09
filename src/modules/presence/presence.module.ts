import { Module } from '@nestjs/common';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceStoreService } from './services/presence-store.service';
import { PresenceService } from './services/presence.service';
import { FriendModule } from '../relationship/friend/friend.module';
import { PresenceRepository } from './repositories/presence.repository';

@Module({
	imports: [FriendModule],
	providers: [
		PresenceGateway,
		PresenceStoreService,
		PresenceService,
		PresenceRepository,
	],
})
export class PresenceModule {}
