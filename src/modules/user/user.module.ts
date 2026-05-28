import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { PrismaService } from '@/common/prisma.service';
import { UserRepository } from './repository/user.repository';

@Module({
	controllers: [UserController],
	providers: [UserService, UserRepository, PrismaService],
	exports: [UserService],
})
export class UserModule {}
