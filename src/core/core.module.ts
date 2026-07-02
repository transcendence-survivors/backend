import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';
import { StorageModule } from './storage/storage.module';

@Global()
@Module({
	imports: [EmailModule, DatabaseModule, ConfigModule, SecurityModule, StorageModule],
	exports: [EmailModule, DatabaseModule, ConfigModule, StorageModule],
})
export class CoreModule {}
