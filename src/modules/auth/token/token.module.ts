import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '../../../core/security/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../../../core/security/strategies/refresh-token.strategy';
import { TokenService } from './service/token.service';
import { PasswordTokenRepository } from './repository/password-token.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
	imports: [JwtModule],
	providers: [
		AccessTokenStrategy,
		RefreshTokenStrategy,
		TokenService,
		PasswordTokenRepository,
		RefreshTokenRepository,
	],
	exports: [TokenService],
})
export class TokenModule {}
