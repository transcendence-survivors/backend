import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '@/common/services/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CommonModule } from '@/common/common.module';

@Module({
	imports: [CommonModule],
	controllers: [UserController],
	providers: [UserService, UserRepository, PrismaService],
	exports: [UserService, UserRepository],
})
export class UserModule {}
