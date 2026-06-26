import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';
import { WebsocketModule } from './websocket/websocket.module';

@Global()
@Module({
	imports: [
		EmailModule,
		DatabaseModule,
		ConfigModule,
		SecurityModule,
		WebsocketModule,
	],
	exports: [
		EmailModule,
		DatabaseModule,
		ConfigModule,
		WebsocketModule,
		SecurityModule,
	],
})
export class CoreModule {}
