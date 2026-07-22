import { Module } from '@nestjs/common';
import { RepostController } from './controllers/repost.controller';
import { RepostRepository } from './repositories/repost.repositories';
import { RepostService } from './services/repost.service';

@Module({
	controllers: [RepostController],
	providers: [RepostRepository, RepostService],
	exports: [RepostRepository],
})
export class RepostModule {}
