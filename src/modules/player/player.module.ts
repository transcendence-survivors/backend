import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { PrismaService } from '@/common/prisma.service';

@Module({
	controllers: [PlayerController],
	providers: [PlayerService, PlayerRepository, PrismaService],
})
export class PlayerModule {}
