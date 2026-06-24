import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { TokenService } from './service/token.service';
import { PasswordTokenRepository } from './repository/password-token.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { RoleService } from './service/roles.service';

@Module({
	imports: [JwtModule],
	providers: [
		AccessTokenStrategy,
		RefreshTokenStrategy,
		TokenService,
		PasswordTokenRepository,
		RefreshTokenRepository,
		RoleService,
	],
	exports: [TokenService],
})
export class TokenModule {}
