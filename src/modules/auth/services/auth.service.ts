import { HttpException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import CreateUserDto from '@/modules/auth/dto/signup.dto';
import { UserService } from '@/modules/user/services/user.service';
import { ProviderRepository } from '../repositories/provider.repository';
import SignInDto from '@/modules/auth/dto/signin.dto';
import { JwtRefreshPayloadParams } from '../../token/strategies/refresh-token.strategy';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import UserNotFoundException from '@/modules/user/exceptions/user.not-find.exception';
import { TokenService } from '../../token/service/token.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { EmailService } from '@/modules/email/services/email.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class AuthService {
	private readonly SALT = 10;

	constructor(
		private readonly providerRepo: ProviderRepository,
		private readonly userService: UserService,
		private readonly userRepo: UserRepository,
		private readonly tokenService: TokenService,
		private readonly emailService: EmailService,
		private readonly prisma: PrismaService,
	) {}

	async signInLocale({ usernameOrEmail, password }: SignInDto) {
		const { user } = await this.validateLocaleProvider(
			usernameOrEmail,
			password,
		);

		const { accessToken, refreshToken } = await this.tokenService.buildJWT({
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
		await this.emailService.sendWelcomeEmail(
			{
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				name: userData.username,
			},
			userData.localePreference,
		);

		const { accessToken, refreshToken } = await this.tokenService.buildJWT({
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
		return this.tokenService.generateAccess({
			userId: userData.id,
			...userData,
		});
	}

	async forgotPassword({ email }: ForgotPasswordDto) {
		const exist = await this.userRepo.getIdByEmail(email);
		if (!exist) {
			throw new UserNotFoundException();
		}
		const token = await this.tokenService.createPasswordReset(exist.id);
		await this.emailService.sendResetPassword(
			email,
			token,
			exist.localePreference,
		);
	}

	async resetPassword({ token, newPassword }: ResetPasswordDto) {
		const { id, userId } =
			await this.tokenService.getValidPasswordReset(token);
		const hash = await this.hashPassword(newPassword);

		await this.prisma.$transaction([
			this.providerRepo.updateLocalePassword(userId, hash),
			this.tokenService.usePasswordResetToken(id),
			this.tokenService.revokeUserRefresh(userId),
		]);
	}

	async validateLocaleProvider(usernameOrEmail: string, password: string) {
		const provider =
			await this.providerRepo.findLocaleByUsernameOrEmail(
				usernameOrEmail,
			);
		if (!provider || !provider.password) {
			throw new HttpException('Invalid credentials', 401);
		}
		const isMatch = await this.comparePassword(password, provider.password);
		if (!isMatch) {
			throw new HttpException('Invalid credentials', 401);
		}
		return provider;
	}

	private async createLocaleProvider(userId: string, password: string) {
		const hash = await this.hashPassword(password);
		return this.providerRepo.createLocale(hash, userId);
	}

	private hashPassword(password: string) {
		return hash(password, this.SALT);
	}

	private comparePassword(password: string, hash: string) {
		return compare(password, hash);
	}
}
