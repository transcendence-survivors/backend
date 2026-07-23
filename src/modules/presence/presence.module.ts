import { Module } from '@nestjs/common';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceStoreService } from './services/presence-store.service';
import { PresenceService } from './services/presence.service';
import { FriendModule } from '../relationship/friend/friend.module';
import { PresenceRepository } from './repositories/presence.repository';
import { PresenceMapper } from './mappers/presence.mapper';
import { PresenceBroadcaster } from './broadcasters/presence.broadcaster';
import { PresenceListener } from './listeners/presence.listener';
import { PRESENCE_STORE } from '@/contracts/services/presence/presence-store.port';

@Module({
	imports: [FriendModule],
	providers: [
		PresenceStoreService,
		PresenceService,
		PresenceRepository,
		PresenceMapper,
		PresenceGateway,
		PresenceBroadcaster,
		PresenceListener,
		{
			provide: PRESENCE_STORE,
			useExisting: PresenceStoreService,
		},
	],
	exports: [PRESENCE_STORE],
})
export class PresenceModule {}
