import { Injectable } from '@nestjs/common';
import { AuthSignInDto } from '../dtos/requests/auth-signin.dto';
import { AuthSignUpDto } from '../dtos/requests/auth-signup.dto';
import { AuthForgotPasswordDto } from '../dtos/requests/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dtos/requests/auth-reset-password.dto';
import { TokenService } from '../token/service/token.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	APP_EVENTS,
	UserCreatedEvent,
	PasswordResetRequestedEvent,
} from '@/contracts/events/internal';
import { LocalAuthProviderService } from '../auth-provider/services/local-auth.services';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import { type IUserService } from '@/contracts/services/user/user-service.port';
import { UnitOfWork } from '@/core/database/uow/unit-of-work';
import { JwtRefreshPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { AuthMapper } from '../mappers/auth.mapper';
import { AuthSignIn } from '../types/records/auth-signin.type';
import { AuthSignUp } from '../types/records/auth-signup.type';
import { AuthRefresh } from '../types/records/auth-refresh.type';
import {
	AuthInvalidCurrentPasswordException,
	AuthSamePasswordException,
} from '../exceptions/auth-bad.exceptions';
import {
	AuthLoginException,
	AuthRefreshException,
	AuthUserNotFoundException,
} from '../exceptions/auth-unauthorized.exceptions';
import { AuthPasswordChangeDto } from '../dtos/requests/aut-password-change.dto';
import { AuthTokenPair } from '../token/types/records/auth-token-pair.type';
import { AuthDeleteAccountDto } from '../dtos/requests/auth-delete-account.dto';
import { UserDeletedEvent } from '@/contracts/events/internal/user/user-deleted.event';
import { PasswordChangedEvent } from '@/contracts/events/internal/password/password-change.event';

@Injectable()
export class AuthService {
	constructor(
		@InjectUserService() private readonly userService: IUserService,
		private readonly uow: UnitOfWork,
		private readonly localAuth: LocalAuthProviderService,
		private readonly tokenService: TokenService,
		private readonly eventEmitter: EventEmitter2,
		private readonly authMapper: AuthMapper,
	) {}

	async logout(user: JwtRefreshPayload): Promise<void> {
		await this.tokenService.logout(user);
	}

	async signInLocale({
		password,
		usernameOrEmail,
	}: AuthSignInDto): Promise<AuthSignIn> {
		const authUser = await this.localAuth.validate(
			usernameOrEmail,
			password,
		);

		const user = await this.userService.getAuthData(authUser.id);
		if (!user) throw new AuthLoginException();

		const { accessToken, refreshToken } = await this.tokenService.buildJWT({
			sub: user.id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			role: user.role,
		});
		const dto = this.authMapper.toUserResponse(user);
		return {
			accessToken,
			refreshToken,
			user: dto,
		};
	}

	async signUpLocale({
		password,
		...userData
	}: AuthSignUpDto): Promise<AuthSignUp> {
		const user = await this.uow.run(async (ctx) => {
			const user = await this.userService.createUserOrThrow(
				{
					bio: userData.bio,
					birthDate: userData.dateOfBirth,
					displayName: userData.displayName,
					email: userData.email,
					firstName: userData.firstName,
					gender: userData.gender,
					lastName: userData.lastName,
					localePreference: userData.localePreference,
					username: userData.username,
				},
				ctx,
			);
			await this.localAuth.create(user.id, password, ctx);
			return user;
		});

		this.eventEmitter.emit(
			APP_EVENTS.USER_CREATED,
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
			displayName: user.displayName,
			username: userData.username,
			email: userData.email,
			role: user.role,
		});

		const dto = this.authMapper.toUserResponse(user);
		return {
			accessToken,
			refreshToken,
			user: dto,
		};
	}

	async refresh(user: JwtRefreshPayload): Promise<AuthRefresh> {
		await this.tokenService.validateRefresh(user);
		const userData = await this.userService.getAuthData(user.sub);
		if (!userData) throw new AuthRefreshException();
		const accessToken = await this.tokenService.generateAccess({
			sub: userData.id,
			email: userData.email,
			username: userData.username,
			displayName: userData.displayName,
			role: userData.role,
		});

		return { accessToken };
	}

	async forgotPassword(dto: AuthForgotPasswordDto): Promise<void> {
		const user = await this.userService.getLocalPreferenceByEmail(
			dto.email,
		);
		if (!user) return;

		const token = await this.tokenService.createPasswordReset(user.id);
		this.eventEmitter.emit(
			APP_EVENTS.PASSWORD_RESET_REQUESTED,
			new PasswordResetRequestedEvent(
				dto.email,
				token,
				user.localePreference,
			),
		);
	}

	async resetPassword(dto: AuthResetPasswordDto): Promise<void> {
		const { id, userId } = await this.tokenService.getValidPasswordReset(
			dto.token,
		);

		const user = await this.uow.run(async (ctx) => {
			await this.localAuth.updatePassword(userId, dto.newPassword, ctx);
			await this.tokenService.usePasswordResetToken(id, ctx);
			await this.tokenService.revokeUserRefresh(userId, ctx);
			return this.userService.getAuthData(userId, ctx);
		});

		if (user) {
			this.eventEmitter.emit(
				APP_EVENTS.PASSWORD_CHANGED,
				new PasswordChangedEvent(
					user.email,
					user.username,
					user.localePreference,
				),
			);
		}
	}

	async changePassword(
		userId: string,
		dto: AuthPasswordChangeDto,
	): Promise<AuthTokenPair> {
		if (dto.currentPassword === dto.newPassword)
			throw new AuthSamePasswordException();

		const isCurrentPasswordValid = await this.localAuth.verifyPassword(
			userId,
			dto.currentPassword,
		);
		if (!isCurrentPasswordValid)
			throw new AuthInvalidCurrentPasswordException();

		const user = await this.uow.run(async (ctx) => {
			await this.localAuth.updatePassword(userId, dto.newPassword, ctx);
			await this.tokenService.revokeUserRefresh(userId, ctx);
			return this.userService.getAuthData(userId, ctx);
		});
		if (!user) throw new AuthUserNotFoundException();

		this.eventEmitter.emit(
			APP_EVENTS.PASSWORD_CHANGED,
			new PasswordChangedEvent(
				user.email,
				user.username,
				user.localePreference,
			),
		);

		return this.tokenService.buildJWT({
			sub: user.id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			role: user.role,
		});
	}

	async deleteAccount(
		userId: string,
		dto: AuthDeleteAccountDto,
	): Promise<void> {
		const user = await this.userService.getAuthData(userId);
		if (!user) throw new AuthUserNotFoundException();

		const isPasswordValid = await this.localAuth.verifyPassword(
			userId,
			dto.password,
		);

		if (!isPasswordValid) {
			throw new AuthInvalidCurrentPasswordException();
		}

		await this.uow.run(async (ctx) => {
			await this.tokenService.revokeUserRefresh(userId, ctx);
			await this.userService.delete(userId, ctx);
		});

		this.eventEmitter.emit(
			APP_EVENTS.USER_DELETED,
			new UserDeletedEvent(
				user.email,
				user.username,
				user.localePreference,
			),
		);
	}
}
