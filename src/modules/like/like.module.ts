import { Module } from '@nestjs/common';
import { LikeController } from './controllers/like.controller';
import { LikeRepository } from './repositories/like.repository';
import { LikeService } from './services/like.service';

@Module({
	controllers: [LikeController],
	providers: [LikeRepository, LikeService],
})
export class LikeModule {}
