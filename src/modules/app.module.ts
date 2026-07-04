import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { CoreModule } from '@/core/core.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModule } from '@/shared/shared.module';
import { PostModule } from './post/post.module';
import { RelationshipsModule } from './relationship/relationship.module';
import { LikeModule } from './like/like.module';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		CoreModule,
		SharedModule,
		AuthModule,
		UserModule,
		PostModule,
		RelationshipsModule,
		LikeModule,
	],
})
export class AppModule {}
