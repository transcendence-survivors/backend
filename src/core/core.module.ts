import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { StorageModule } from './storage/storage.module';

@Global()
@Module({
	imports: [
		EmailModule,
		DatabaseModule,
		ConfigModule,
		SecurityModule,
		WebsocketModule,
		RateLimitModule,
		StorageModule,
	],
	exports: [
		EmailModule,
		DatabaseModule,
		ConfigModule,
		WebsocketModule,
		SecurityModule,
		RateLimitModule,
		StorageModule,
	],
})
export class CoreModule {}
