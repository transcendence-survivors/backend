import { Injectable } from '@nestjs/common';
import { InjectEnv } from '@/modules/env/injects/env.inject';
import { JwtAccessPayloadParams } from '../strategies/access-token.strategy';
import { createHash, randomBytes } from 'crypto';

import { JwtRefreshPayloadParams } from '../strategies/refresh-token.strategy';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { JwtService } from '@nestjs/jwt';
import { PasswordTokenRepository } from '../repository/password-token.repository';
import { type Env } from '@/modules/env/providers/env.provider';

import TokenNotFoundException from '../exceptions/token.not-fing.exception';
import TokenRevokedException from '../exceptions/token.revoked.exception';
import TokenExpiredException from '../exceptions/token.expired.exception';

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

	logout(user: JwtRefreshPayloadParams) {
		return this.refreshRepo.revoke(this.hash(user.refreshToken));
	}

	async buildJWT({ userId, role, email, username }: JwtAccessPayloadParams) {
		const [refreshToken, accessToken] = await Promise.all([
			this.createRefresh(userId),
			this.generateAccess({ userId, role, email, username }),
		]);

		return { refreshToken, accessToken };
	}

	generateAccess({ userId, role, email, username }: JwtAccessPayloadParams) {
		const payload = { sub: userId, role, email, username };
		return this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.accessToken.ms}ms`,
			secret: this.env.accessToken.secret,
		});
	}

	async createRefresh(userId: string) {
		const refreshToken = await this.generateRefresh(userId);
		await this.refreshRepo.save({
			hashedToken: this.hash(refreshToken),
			expireInMs: this.env.refreshToken.ms,
			userId,
		});
		return refreshToken;
	}

	async createPasswordReset(userId: string) {
		const resetToken = this.generatePasswordResetToken();
		await this.passwordRepo.save({
			hashedToken: this.hash(resetToken),
			userId,
			expireInMs: this.env.passwordResetToken.ms,
		});
		return resetToken;
	}

	usePasswordResetToken(tokenId: string) {
		return this.passwordRepo.use(tokenId);
	}

	revokeUserRefresh(userId: string) {
		return this.refreshRepo.revokeUser(userId);
	}

	async validateRefresh(user: JwtRefreshPayloadParams) {
		const hashToken = this.hash(user.refreshToken);
		const token = await this.refreshRepo.get(hashToken, user.userId);

		if (!token) throw new TokenNotFoundException();
		if (token.isRevoked) throw new TokenRevokedException();

		if (new Date(Date.now()) <= token.expiredAt) {
			return;
		}

		await this.refreshRepo.revoke(hashToken);
		throw new TokenExpiredException();
	}

	async getValidPasswordReset(token: string) {
		const hashedToken = this.hash(token);
		const passwordToken =
			await this.passwordRepo.getByHashToken(hashedToken);
		if (!passwordToken) {
			throw new TokenNotFoundException();
		}
		return passwordToken;
	}

	private generateRefresh(userId: string) {
		const payload = { sub: userId };
		return this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.refreshToken.ms}ms`,
			secret: this.env.refreshToken.secret,
		});
	}

	private generatePasswordResetToken() {
		return randomBytes(32).toString('hex');
	}

	private hash(refreshToken: string) {
		return createHash(this.HASH_PROTOCOL)
			.update(refreshToken)
			.digest(this.HEX_DIGEST);
	}
}
