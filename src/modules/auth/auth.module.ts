import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserService } from '../user/service/user.service';
import { PrismaService } from '@/common/prisma.service';
import { TokenRepository } from './repository/token.repository';
import { JwtModule } from '@nestjs/jwt';
import { ProviderRepository } from './repository/provider.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
	imports: [JwtModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		PrismaService,
		TokenRepository,
		ProviderRepository,
		UserRepository,
	],
})
export class AuthModule {}
