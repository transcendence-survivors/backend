import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';
import { LikeModule } from '../like/like.module';
import { UserModule } from '../user/user.module';
import { RepostModule } from '../repost/repost.module';
import { PostMapper } from './mappers/post.mapper';

@Module({
	imports: [LikeModule, UserModule, RepostModule],
	controllers: [PostController],
	providers: [PostRepository, PostService, PostMapper],
})
export class PostModule {}
