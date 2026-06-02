import { HttpException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { UserService } from '@/modules/user/service/user.service';
import { ProviderRepository } from '../repository/provider.repository';
import { UserPassword, UserUsername } from '@/modules/user/user.fields';
import SignInDto from '@/modules/user/dto/signin.dto';
import { JwtRefreshPayloadParams } from '../../token/strategies/refresh-token.strategy';
import { UserRepository } from '@/modules/user/repository/user.repository';
import UserNotFoundException from '@/modules/user/exception/user.not-find.exception';
import { TokenService } from '../../token/service/token.service';

@Injectable()
export class AuthService {
	private static readonly SALT = 10;

	constructor(
		private providerRepo: ProviderRepository,
		private userService: UserService,
		private userRepo: UserRepository,
		private tokenService: TokenService,
	) {}

	async signInLocale({ username, password }: SignInDto) {
		const { user } = await this.validateLocaleProvider(username, password);

		const { accessToken, refreshToken } =
			await this.tokenService.buildTokens({
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

		const { accessToken, refreshToken } =
			await this.tokenService.buildTokens({
				userId: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			});
		return { accessToken, refreshToken, user };
	}

	async refresh(user: JwtRefreshPayloadParams) {
		await this.tokenService.validateRefresh(user);
		const userData = await this.userRepo.getTokenData(user.userId);
		if (!userData) {
			throw new UserNotFoundException();
		}
		return this.tokenService.generateAccessToken({
			userId: userData.id,
			...userData,
		});
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

	async hashPassword(password: string): Promise<string> {
		return await hash(password, AuthService.SALT);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await compare(password, hash);
	}
}
