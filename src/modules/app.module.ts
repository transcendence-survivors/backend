import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { EmailModule } from './email/email.module';

@Module({
	imports: [EnvModule, AuthModule, EmailModule],
})
export class AppModule {}
