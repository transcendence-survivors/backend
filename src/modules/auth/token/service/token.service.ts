import { Injectable } from '@nestjs/common';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { JwtService } from '@nestjs/jwt';
import { PasswordTokenRepository } from '../repository/password-token.repository';
import { type Env } from '@/core/config/env/providers/env.provider';

import { TokenNotFoundException } from '../exceptions/token-not-found.exception';
import { TokenRevokedException } from '../exceptions/token-revoked.exception';
import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { DbContext } from '@/core/database/uow/db-context';
import {
	JwtAccessPayload,
	JwtRefreshPayload,
} from '@/core/security/interfaces/jwt-payload.interface';
import { AuthTokenPair } from '../types/records/auth-token-pair.type';
import { RefreshTokenId } from '../types/records/refresh-token-id.type';
import { PasswordTokenByHash } from '../types/records/password-token-by-hash.type';
import { PasswordTokenUsed } from '../types/records/password-token-used.type';

@Injectable()
export class TokenService {
	private readonly HASH_PROTOCOL = 'sha256';
	private readonly HEX_DIGEST = 'hex';

	constructor(
		private readonly refreshRepo: RefreshTokenRepository,
		private readonly passwordRepo: PasswordTokenRepository,
		private readonly jwtService: JwtService,
		@InjectEnv() private readonly env: Env,
	) {}

	logout(user: JwtRefreshPayload): Promise<RefreshTokenId> {
		return this.refreshRepo.revoke(this.hash(user.refreshToken));
	}

	async buildJWT(payload: JwtAccessPayload): Promise<AuthTokenPair> {
		const [refreshToken, accessToken] = await Promise.all([
			this.createRefresh(payload.sub),
			this.generateAccess(payload),
		]);

		return { refreshToken, accessToken };
	}

	generateAccess(payload: JwtAccessPayload): Promise<string> {
		return this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.accessToken.ms}ms`,
			secret: this.env.accessToken.secret,
		});
	}

	async createRefresh(userId: string): Promise<string> {
		const refreshToken = await this.generateRefresh(userId);
		await this.refreshRepo.save({
			hashedToken: this.hash(refreshToken),
			expireInMs: this.env.refreshToken.ms,
			userId,
		});
		return refreshToken;
	}

	async createPasswordReset(userId: string): Promise<string> {
		const resetToken = this.generatePasswordResetToken();
		await this.passwordRepo.save({
			hashedToken: this.hash(resetToken),
			userId,
			expireInMs: this.env.passwordResetToken.ms,
		});
		return resetToken;
	}

	async validateRefresh(user: JwtRefreshPayload): Promise<void> {
		const hashToken = this.hash(user.refreshToken);
		const token = await this.refreshRepo.get(hashToken, user.sub);

		if (!token) throw new TokenNotFoundException();
		if (token.isRevoked) throw new TokenRevokedException();

		if (new Date(Date.now()) <= token.expiredAt) {
			return;
		}

		await this.refreshRepo.revoke(hashToken);
		throw new TokenExpiredException();
	}

	async getValidPasswordReset(token: string): Promise<PasswordTokenByHash> {
		const hashedToken = this.hash(token);
		const passwordToken =
			await this.passwordRepo.getByHashToken(hashedToken);
		if (!passwordToken) throw new TokenNotFoundException();
		return passwordToken;
	}

	usePasswordResetToken(
		tokenId: string,
		ctx?: DbContext,
	): Promise<PasswordTokenUsed> {
		return this.passwordRepo.use(tokenId, ctx);
	}
	revokeUserRefresh(userId: string, ctx?: DbContext) {
		return this.refreshRepo.revokeUser(userId, ctx);
	}

	private generateRefresh(userId: string): Promise<string> {
		const payload = { sub: userId, jti: randomUUID() };
		return this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.refreshToken.ms}ms`,
			secret: this.env.refreshToken.secret,
		});
	}

	private generatePasswordResetToken(): string {
		return randomBytes(32).toString('hex');
	}

	private hash(refreshToken: string): string {
		return createHash(this.HASH_PROTOCOL)
			.update(refreshToken)
			.digest(this.HEX_DIGEST);
	}
}
