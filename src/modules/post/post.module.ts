import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PrismaService } from '@/common/services/prisma.service';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';

@Module({
	controllers: [PostController],
	providers: [PrismaService, PostRepository, PostService],
	exports: [],
})
export class PostModule {}
