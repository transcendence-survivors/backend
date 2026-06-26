import { Injectable } from '@nestjs/common';
import SignInDto from '@/modules/auth/dto/signin.dto';
import UserNotFoundException from '@/modules/user/exceptions/user.not-found.exception';
import { TokenService } from '../token/service/token.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResetRequestedEvent } from '@/contracts/events/password-reset-requested.event';
import { AppEvents, UserCreatedEvent } from '@/contracts/events';
import { LocalAuthProviderService } from '../auth-provider/services/local-auth.services';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { UnitOfWork } from '@/core/database/uow/unit-of-work';
import SignUpDto from '@/modules/auth/dto/signup.dto';
import { JwtRefreshPayload } from '@/core/security/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly uow: UnitOfWork,
		private readonly localAuth: LocalAuthProviderService,
		private readonly tokenService: TokenService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async signInLocale(dto: SignInDto) {
		const provider = await this.localAuth.validate(
			dto.usernameOrEmail,
			dto.password,
		);

		const user = await this.userService.getTokenData(provider.userId);
		if (!user) {
			throw new UserNotFoundException();
		}

		const { accessToken, refreshToken } = await this.tokenService.buildJWT({
			sub: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
		});
		return { accessToken, refreshToken, user };
	}

	async signUpLocale(dto: SignUpDto) {
		const { password, ...userData } = dto;

		const user = await this.uow.run(async (ctx) => {
			const user = await this.userService.createUser(userData, ctx);
			await this.localAuth.create(user.id, password, ctx);
			return user;
		});

		this.eventEmitter.emit(
			AppEvents.USER_CREATED,
			new UserCreatedEvent(
				user.id,
				userData.email,
				userData.firstName,
				userData.lastName,
				userData.username,
				userData.localePreference,
			),
		);

		const { accessToken, refreshToken } = await this.tokenService.buildJWT({
			sub: user.id,
			username: userData.username,
			email: userData.email,
			role: user.role,
		});
		return { accessToken, refreshToken, user };
	}

	async refresh(user: JwtRefreshPayload) {
		await this.tokenService.validateRefresh(user);
		const userData = await this.userService.getTokenData(user.sub);
		if (!userData) {
			throw new UserNotFoundException();
		}
		return this.tokenService.generateAccess({
			sub: userData.id,
			...userData,
		});
	}

	async forgotPassword(dto: ForgotPasswordDto) {
		const user = await this.userService.getLocalPreferenceByEmail(
			dto.email,
		);
		if (!user) throw new UserNotFoundException();
		const token = await this.tokenService.createPasswordReset(user.id);

		this.eventEmitter.emit(
			AppEvents.PASSWORD_RESET_REQUESTED,
			new PasswordResetRequestedEvent(
				dto.email,
				token,
				user.localePreference,
			),
		);
	}

	async resetPassword(dto: ResetPasswordDto) {
		const { id, userId } = await this.tokenService.getValidPasswordReset(
			dto.token,
		);

		await this.uow.run(async (ctx) => {
			await this.localAuth.updatePassword(userId, dto.newPassword, ctx);
			await this.tokenService.usePasswordResetToken(id, ctx);
			await this.tokenService.revokeUserRefresh(userId, ctx);
		});
	}
}
