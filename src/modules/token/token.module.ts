import { PrismaService } from '@/common/prisma.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token.service';
import { TokenRepository } from '../auth/repository/token.repository';

@Module({
	imports: [JwtModule],
	providers: [
		PrismaService,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		TokenService,
		TokenRepository,
	],
	exports: [RefreshTokenStrategy, AccessTokenStrategy, TokenService],
})
export class TokenModule {}
