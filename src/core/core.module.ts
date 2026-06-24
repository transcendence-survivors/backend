import { Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
	imports: [EmailModule, DatabaseModule, ConfigModule],
	exports: [EmailModule, DatabaseModule, ConfigModule],
})
export class CoreModule {}
