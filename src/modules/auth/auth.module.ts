import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PrismaService } from '@/common/prisma.service';
import { TokenRepository } from './repository/token.repository';
import { JwtModule } from '@nestjs/jwt';
import { ProviderRepository } from './repository/provider.repository';
import { UserModule } from '../user/user.module';

@Module({
	imports: [JwtModule, UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		TokenRepository,
		ProviderRepository,
		PrismaService,
	],
})
export class AuthModule {}
