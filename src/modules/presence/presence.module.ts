import { Module } from '@nestjs/common';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceStoreService } from './services/presence-store.service';

@Module({
	imports: [],
	providers: [PresenceGateway, PresenceStoreService],
})
export class PresenceModule {}
