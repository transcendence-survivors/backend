import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthSignInDto } from '@/modules/auth/dtos/requests/auth-signin.dto';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { CurrentUserRefresh } from '@/core/security/decorators/current-user.decorator';
import { AuthForgotPasswordDto } from '../dtos/requests/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dtos/requests/auth-reset-password.dto';
import { AuthSignUpDto } from '@/modules/auth/dtos/requests/auth-signup.dto';
import { JWTRefreshGuard } from '@/core/security/guards/jwt-refresh.guard';
import { type Response } from 'express';
import { type Env } from '@/core/config/env/providers/env.provider';
import { type JwtRefreshPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { AuthUserResponseDto } from '../dtos/responses/auth-user-response.dto';
import {
	ApiCreatedSuccessResponse,
	ApiNoContentSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import { ApiTokenNotFoundResponse } from '../token/decorators/token-api-errors.decorators';
import { ApiAuthProviderCredentialsResponse } from '../auth-provider/decorators/auth-provider-api-errors';
import { ApiGroupedErrorResponse } from '@/shared/decorators/api-error-response.decorator';
import { AuthRefreshException } from '../exceptions/auth-refresh-exception';
import { TokenNotFoundException } from '../token/exceptions/token-not-found.exception';
import { TokenRevokedException } from '../token/exceptions/token-revoked.exception';
import { TokenExpiredException } from '../token/exceptions/token-expired.exception';
import { AuthProviderCredentialsException } from '../auth-provider/exceptions/auth-provider-credentials.exception';
import { AuthLoginException } from '../exceptions/auth-login-exception.exceptions';
import {
	AuthThrottle,
	StrictAuthThrottle,
	TokenRefreshThrottle,
} from '@/core/rate-limit/decorators/throttle-presets.decorator';

@Controller('auth')
export class AuthController {
	private readonly REFRESH_TOKEN = 'refreshToken';
	private readonly ACCESS_TOKEN = 'accessToken';

	constructor(
		private readonly authService: AuthService,
		@InjectEnv() private readonly env: Env,
	) {}

	@AuthThrottle()
	@Post('login')
	@HttpCode(200)
	@ApiBodyDto(AuthSignInDto)
	@ApiSuccessResponse(AuthUserResponseDto)
	@ApiValidationErrorResponse({
		usernameOrEmail: ['Username or email is required'],
		password: ['Password must be contained 1 uppercase letter.'],
	})
	@ApiGroupedErrorResponse([
		AuthProviderCredentialsException,
		AuthLoginException,
	])
	@ResponseEnvelope('User logged in successfully')
	async signIn(
		@Body() signInDto: AuthSignInDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthUserResponseDto> {
		const { refreshToken, accessToken, user } =
			await this.authService.signInLocale(signInDto);
		this.setAccessTokenCookie(res, accessToken);
		this.setRefreshTokenCookie(res, refreshToken);
		return user;
	}

	@AuthThrottle()
	@Post('register')
	@HttpCode(201)
	@ApiBodyDto(AuthSignUpDto)
	@ApiCreatedSuccessResponse(AuthUserResponseDto)
	@ApiValidationErrorResponse({
		username: ['Username is required'],
		email: ['Email is required'],
		password: ['Password must be contained 1 uppercase letter.'],
		firstName: ['First name is required'],
		lastName: ['Last name is required'],
		dateOfBirth: ['Date of birth is required'],
		gender: ['Gender is required'],
		localePreference: ['Locale preference is required'],
		displayName: ['Display name is required'],
		bio: ['Bio is required'],
	})
	@ResponseEnvelope('User registered successfully')
	async signUp(
		@Body() signUpDto: AuthSignUpDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthUserResponseDto> {
		const { refreshToken, accessToken, user } =
			await this.authService.signUpLocale(signUpDto);
		this.setAccessTokenCookie(res, accessToken);
		this.setRefreshTokenCookie(res, refreshToken);
		return user;
	}

	@TokenRefreshThrottle()
	@UseGuards(JWTRefreshGuard)
	@Post('refresh')
	@HttpCode(204)
	@ApiNoContentSuccessResponse({
		description: 'Token refreshed successfully',
	})
	@ApiGroupedErrorResponse([
		AuthRefreshException,
		TokenNotFoundException,
		TokenRevokedException,
		TokenExpiredException,
	])
	async refresh(
		@CurrentUserRefresh() user: JwtRefreshPayload,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const { accessToken } = await this.authService.refresh(user);
		this.setAccessTokenCookie(res, accessToken);
	}

	@UseGuards(JWTRefreshGuard)
	@Post('logout')
	@HttpCode(204)
	@ApiNoContentSuccessResponse({
		description: 'User logged out successfully',
	})
	@ApiAuthProviderCredentialsResponse()
	async logout(
		@CurrentUserRefresh() user: JwtRefreshPayload,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		await this.authService.logout(user);
		res.clearCookie(this.REFRESH_TOKEN);
		res.clearCookie(this.ACCESS_TOKEN);
	}

	@StrictAuthThrottle()
	@Post('forgot-password')
	@HttpCode(204)
	@ApiBodyDto(AuthForgotPasswordDto)
	@ApiNoContentSuccessResponse({
		description: 'Password reset email sent successfully',
	})
	@ApiValidationErrorResponse({ email: ['Email is required'] })
	async forgotPassword(@Body() dto: AuthForgotPasswordDto): Promise<void> {
		await this.authService.forgotPassword(dto);
	}

	@StrictAuthThrottle()
	@Post('reset-password')
	@HttpCode(204)
	@ApiBodyDto(AuthResetPasswordDto)
	@ApiNoContentSuccessResponse({
		description: 'Password reset successfully',
	})
	@ApiValidationErrorResponse({
		token: ['Token is required'],
		newPassword: ['New password must be contained 1 uppercase letter.'],
	})
	@ApiTokenNotFoundResponse()
	async resetPassword(@Body() dto: AuthResetPasswordDto): Promise<void> {
		await this.authService.resetPassword(dto);
	}

	private setAccessTokenCookie(res: Response, accessToken: string): void {
		res.cookie(this.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			maxAge: this.env.accessToken.s,
			secure: this.env.nodeEnv !== 'development',
			sameSite: this.env.nodeEnv === 'development' ? 'lax' : 'strict',
			path: '/',
		});
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		res.cookie(this.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			maxAge: this.env.refreshToken.s,
			secure: this.env.nodeEnv !== 'development',
			sameSite: this.env.nodeEnv === 'development' ? 'lax' : 'strict',
			path: '/',
		});
	}
}
