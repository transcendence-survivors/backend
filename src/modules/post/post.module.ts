import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';
import { LikeModule } from '../like/like.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [LikeModule, UserModule],
	controllers: [PostController],
	providers: [PostRepository, PostService],
})
export class PostModule {}
