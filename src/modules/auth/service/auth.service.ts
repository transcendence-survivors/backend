import { HttpException, Injectable } from '@nestjs/common';
import { TokenRepository } from '../repository/token.repository';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { UserService } from '@/modules/user/service/user.service';
import { ProviderRepository } from '../repository/provider.repository';
import { UserRole } from '@prisma-generated/enums';

@Injectable()
export class AuthService {
	private static readonly SALT = 10;

	constructor(
		private repo: TokenRepository,
		private jwtService: JwtService,
		private providerRepo: ProviderRepository,
		private userService: UserService,
	) {}

	async signInLocale(userId: string, password: string) {
		const provider = await this.validateLocaleProvider(userId, password);
		return provider;
	}

	async signUpLocale({ password, ...userData }: CreateUserDto) {
		const user = await this.userService.create(userData);
		await this.createLocaleProvider(user.id, password);

		const refreshToken = await this.createRefreshToken(user.id);
		const accessToken = await this.createAccessToken(user.id, user.role);

		return { accessToken, refreshToken, user };
	}

	async createLocaleProvider(userId: string, password: string) {
		const hash = await this.hashPassword(password);
		return this.providerRepo.createLocale(hash, userId);
	}

	async validateLocaleProvider(userId: string, password: string) {
		const provider = await this.providerRepo.findLocaleByUserId(userId);
		if (!provider || !provider.password) {
			throw new HttpException('Invalid credentials', 401);
		}
		const isMatch = await compare(password, provider.password);
		if (!isMatch) {
			throw new HttpException('Invalid credentials', 401);
		}
		return provider;
	}

	async createRefreshToken(userId: string) {
		const payload = { sub: userId };
		return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
	}

	async createAccessToken(userId: string, role: UserRole) {
		const payload = { sub: userId, role };
		return await this.jwtService.signAsync(payload, { expiresIn: '15m' });
	}

	async hashPassword(password: string): Promise<string> {
		const hashed = await hash(password, AuthService.SALT);
		return hashed;
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await compare(password, hash);
	}

	// async hashToken(token: string) {}
}
