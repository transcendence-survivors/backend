import { Module } from '@nestjs/common';
import { BlockController } from './controllers/block.controller';
import { BlockRepository } from './repositories/block.repository';
import { BlockService } from './services/block.service';
import { UserModule } from '@/modules/user/user.module';
import { BLOCK_SERVICE } from '@/contracts/services/block/block-service.port';

@Module({
	imports: [UserModule],
	controllers: [BlockController],
	providers: [
		BlockRepository,
		BlockService,
		{
			provide: BLOCK_SERVICE,
			useExisting: BlockService,
		},
	],
	exports: [BLOCK_SERVICE],
})
export class BlockModule {}
