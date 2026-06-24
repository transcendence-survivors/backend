import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { UnitOfWork } from './uow/unit-of-work';

@Module({
	imports: [],
	providers: [PrismaService, UnitOfWork],
	exports: [PrismaService, UnitOfWork],
})
export class DatabaseModule {}
