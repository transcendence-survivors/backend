import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';

@Global()
@Module({
	imports: [EmailModule, DatabaseModule, ConfigModule, SecurityModule],
	exports: [EmailModule, DatabaseModule, ConfigModule],
})
export class CoreModule {}
