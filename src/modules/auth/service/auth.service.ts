import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenRepository } from '../repository/token.repository';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { UserService } from '@/modules/user/service/user.service';
import { ProviderRepository } from '../repository/provider.repository';
import { UserRole } from '@prisma-generated/enums';
import { createHash } from 'node:crypto';
import { UserPassword, UserUsername } from '@/modules/user/user.fields';
import SignInDto from '@/modules/user/dto/signin.dto';
import { InjectEnv } from '@/modules/config/env/inject';
import { type Env } from '@/modules/config/env/env.provider';
import { JwtUserRefreshPayload } from '../strategies/refresh-token.strategy';
import { UserRepository } from '@/modules/user/repository/user.repository';
import UserNotFoundException from '@/modules/user/exception/user.not-find.exception';

interface AccessJwtPayload {
	userId: string;
	role: UserRole;
	email: string;
	username: string;
}

@Injectable()
export class AuthService {
	private static readonly SALT = 10;

	constructor(
		private tokenRepo: TokenRepository,
		private jwtService: JwtService,
		private providerRepo: ProviderRepository,
		private userService: UserService,
		@InjectEnv() private env: Env,
		private userRepo: UserRepository,
	) {}

	async signInLocale({ username, password }: SignInDto) {
		const { user } = await this.validateLocaleProvider(username, password);

		const { accessToken, refreshToken } = await this.buildTokens({
			userId: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
		});
		return { accessToken, refreshToken, user };
	}

	async signUpLocale({ password, ...userData }: CreateUserDto) {
		const user = await this.userService.create(userData);
		await this.createLocaleProvider(user.id, password);

		const { accessToken, refreshToken } = await this.buildTokens({
			userId: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
		});
		return { accessToken, refreshToken, user };
	}

	async refresh(user: JwtUserRefreshPayload) {
		const hashToken = this.hashToken(user.refreshToken);
		const token = await this.tokenRepo.hasRefreshToken(
			hashToken,
			user.userId,
		);
		console.log('dfae');
		if (!token)
			throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
		if (token.isRevoked === true)
			throw new HttpException('Token revoked', HttpStatus.UNAUTHORIZED);
		if (new Date(Date.now()) > token.expiredAt) {
			await this.tokenRepo.revokeToken(hashToken);
			throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
		}
		const userData = await this.userRepo.getTokenData(user.userId);
		if (!userData) {
			throw new UserNotFoundException();
		}
		return this.generateAccessToken({ userId: userData.id, ...userData });
	}

	private async buildTokens({
		userId,
		role,
		email,
		username,
	}: AccessJwtPayload) {
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

	async createLocaleProvider(userId: string, password: string) {
		const hash = await this.hashPassword(password);
		return this.providerRepo.createLocale(hash, userId);
	}

	async validateLocaleProvider(
		username: UserUsername,
		password: UserPassword,
	) {
		const provider = await this.providerRepo.findLocaleByUsername(username);
		if (!provider || !provider.password) {
			throw new HttpException('Invalid credentials', 401);
		}
		const isMatch = await this.comparePassword(password, provider.password);
		if (!isMatch) {
			throw new HttpException('Invalid credentials', 401);
		}
		return provider;
	}

	async generateRefreshToken(userId: string) {
		const payload = { sub: userId };
		return await this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.refreshToken.ms}ms`,
			secret: this.env.refreshToken.secret,
		});
	}

	async generateAccessToken({
		userId,
		role,
		email,
		username,
	}: AccessJwtPayload) {
		const payload = { sub: userId, role, email, username };
		return await this.jwtService.signAsync(payload, {
			expiresIn: `${this.env.accessToken.ms}ms`,
			secret: this.env.accessToken.secret,
		});
	}

	async createRefreshToken(userId: string, familyId?: string) {
		const refreshToken = await this.generateRefreshToken(userId);
		await this.tokenRepo.save({
			hashedToken: this.hashToken(refreshToken),
			expireInMs: this.env.refreshToken.ms,
			userId,
			familyId,
		});
		return refreshToken;
	}

	private hashToken(refreshToken: string) {
		return createHash('sha256').update(refreshToken).digest('hex');
	}

	async hashPassword(password: string): Promise<string> {
		return await hash(password, AuthService.SALT);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await compare(password, hash);
	}
}
