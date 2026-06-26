import { Module } from '@nestjs/common';
import { PresenceGateway } from './gateways/presence.gateway';

@Module({
	imports: [],
	providers: [PresenceGateway],
})
export class PresenceModule {}
