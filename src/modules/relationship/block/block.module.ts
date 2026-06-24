import { Module } from '@nestjs/common';
import { BlockController } from './controllers/block.controller';
import { BlockRepository } from './repositories/block.repository';
import { BlockService } from './services/block.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
	imports: [UserModule],
	controllers: [BlockController],
	providers: [BlockRepository, BlockService],
})
export class BlockModule {}
