import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

import { CoreModule } from '@/core/core.module';
import { UserModule } from './modules/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModule } from '@/shared/shared.module';
import { PostModule } from './modules/post/post.module';
import { RelationshipsModule } from './modules/relationship/relationship.module';
import { PresenceModule } from './modules/presence/presence.module';
import { LikeModule } from './modules/like/like.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		CoreModule,
		SharedModule,
		AuthModule,
		UserModule,
		PostModule,
		RelationshipsModule,
		PresenceModule,
		LikeModule,
		ChatModule,
	],
})
export class AppModule {}
