import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';

@Module({
	controllers: [PostController],
	providers: [PostRepository, PostService],
})
export class PostModule {}
