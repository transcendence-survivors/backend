import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { CoreModule } from '@/core/core.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModule } from '@/shared/shared.module';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		CoreModule,
		SharedModule,
		AuthModule,
		UserModule,
	],
})
export class AppModule {}
