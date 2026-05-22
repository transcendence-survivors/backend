import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module'
import { PlayerController } from './player/player.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PlayerModule,
	],
})
export class AppModule {}
