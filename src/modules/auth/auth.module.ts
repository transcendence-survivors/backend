import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserService } from '../user/service/user.service';
import { PrismaService } from '@/common/prisma.service';
import { TokenRepository } from './repository/token.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [JwtModule],
	controllers: [AuthController],
	providers: [AuthService, UserService, PrismaService, TokenRepository],
})
export class AuthModule {}
