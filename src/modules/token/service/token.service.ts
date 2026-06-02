import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenRepository } from '../../auth/repository/token.repository';
import { JwtService } from '@nestjs/jwt';
import { type Env } from '@/modules/config/env/env.provider';
import { InjectEnv } from '@/modules/config/env/inject';
import { JwtAccessPayloadParams } from '../strategies/access-token.strategy';
import { createHash } from 'crypto';
import { JwtRefreshPayloadParams } from '../strategies/refresh-token.strategy';

@Injectable()
export class TokenService {
	private readonly HASH_PROTOCOL = 'sha256';
	private readonly HEX_DIGEST = 'hex';
	constructor(
		private tokenRepo: TokenRepository,
		private jwtService: JwtService,
		@InjectEnv() private env: Env,
	) {}

	async buildTokens({
		userId,
		role,
		email,
		username,
	}: JwtAccessPayloadParams) {
		const [refreshToken, accessToken] = await Promise.all([
			this.createRefreshToken(userId),
			this.generateAccessToken({
				userId,
				role,
				email,
				username,
			}),
		]);

		return { refreshToken, accessToken };
	}

	async generateAccessToken({
		userId,
		role,
		email,
		username,
	}: JwtAccessPayloadParams) {
		const payload = { sub: userId, role, email, username };
		return await this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.accessToken.ms}ms`,
			secret: this.env.accessToken.secret,
		});
	}

	async createRefreshToken(userId: string) {
		const refreshToken = await this.generateRefreshToken(userId);
		await this.tokenRepo.save({
			hashedToken: this.hashToken(refreshToken),
			expireInMs: this.env.refreshToken.ms,
			userId,
		});
		return refreshToken;
	}

	async validateRefresh(user: JwtRefreshPayloadParams) {
		const hashToken = this.hashToken(user.refreshToken);
		const token = await this.tokenRepo.hasRefreshToken(
			hashToken,
			user.userId,
		);
		if (!token)
			throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
		if (token.isRevoked === true)
			throw new HttpException('Token revoked', HttpStatus.UNAUTHORIZED);
		if (new Date(Date.now()) <= token.expiredAt) return;
		await this.tokenRepo.revokeToken(hashToken);
		throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
	}

	private async generateRefreshToken(userId: string) {
		const payload = { sub: userId };
		return await this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.refreshToken.ms}ms`,
			secret: this.env.refreshToken.secret,
		});
	}

	private hashToken(refreshToken: string) {
		return createHash(this.HASH_PROTOCOL)
			.update(refreshToken)
			.digest(this.HEX_DIGEST);
	}
}
