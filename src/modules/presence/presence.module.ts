import { Module } from '@nestjs/common';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceStoreService } from './services/presence-store.service';
import { PresenceService } from './services/presence.service';

@Module({
	imports: [],
	providers: [PresenceGateway, PresenceStoreService, PresenceService],
})
export class PresenceModule {}
