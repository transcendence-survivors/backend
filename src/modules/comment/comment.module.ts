import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';

@Module({
	controllers: [CommentController],
	providers: [CommentRepository, CommentService],
	exports: [CommentRepository],
})
export class CommentModule {}
