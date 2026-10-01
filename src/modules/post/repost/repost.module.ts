import { Module } from '@nestjs/common';
import { RepostController } from './controllers/repost.controller';
import { RepostRepository } from './repositories/repost.repositories';
import { RepostService } from './services/repost.service';
import { RepostMapper } from './mappers/repost.mapper';

@Module({
	controllers: [RepostController],
	providers: [RepostRepository, RepostService, RepostMapper],
	exports: [RepostRepository],
})
export class RepostModule {}
