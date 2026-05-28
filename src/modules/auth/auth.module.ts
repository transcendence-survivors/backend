import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserService } from '../user/service/user.service';
import { PrismaService } from '@/common/prisma.service';
import { AuthRepository } from './repository/token.repository';

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService, PrismaService, AuthRepository],
})
export class AuthModule {}
