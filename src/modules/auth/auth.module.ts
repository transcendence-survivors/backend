import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PrismaService } from '@/common/prisma.service';
import { TokenRepository } from './repository/token.repository';
import { JwtModule } from '@nestjs/jwt';
import { ProviderRepository } from './repository/provider.repository';
import { UserModule } from '../user/user.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
	imports: [JwtModule, UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		PrismaService,
		TokenRepository,
		ProviderRepository,
		AccessTokenStrategy,
		RefreshTokenStrategy,
	],
	exports: [RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
