import { PrismaService } from '@/common/services/prisma.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token.service';
import { PasswordTokenRepository } from './repository/password-token.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
	imports: [JwtModule],
	providers: [
		PrismaService,

		AccessTokenStrategy,
		RefreshTokenStrategy,

		TokenService,

		PasswordTokenRepository,
		RefreshTokenRepository,
	],
	exports: [RefreshTokenStrategy, AccessTokenStrategy, TokenService],
})
export class TokenModule {}
