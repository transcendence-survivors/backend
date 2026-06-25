import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token.service';
import { PasswordTokenRepository } from './repository/password-token.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
	imports: [JwtModule],
	providers: [TokenService, PasswordTokenRepository, RefreshTokenRepository],
	exports: [TokenService],
})
export class TokenModule {}
