import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { type Response } from 'express';
import { BaseController } from '@/common/base.controller';
import { SignInDto } from '@/modules/user/dto/signin.dto';
import { InjectEnv } from '@/modules/config/env/inject';
import { type Env } from '@/modules/config/env/env.provider';
import { RefreshTokenGuard } from '../../token/guards/refresh-token.guard';
import { CurrentUserRefresh } from '@/common/decorators/current-user.decorator';
import { type JwtRefreshPayloadParams } from '../../token/strategies/refresh-token.strategy';

@Controller('auth')
export class AuthController extends BaseController {
	private readonly REFRESH_TOKEN = 'refreshToken';
	private readonly ACCESS_TOKEN = 'accessToken';
	constructor(
		private authService: AuthService,
		@InjectEnv() private env: Env,
	) {
		super();
	}

	@Post('login')
	async signIn(
		@Body() signInDto: SignInDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, accessToken, user } =
			await this.authService.signInLocale(signInDto);
		this.setAccessTokenCookie(res, accessToken);
		this.setRefreshTokenCookie(res, refreshToken);
		return this.ok(user, 'User logged in successfully');
	}

	@HttpCode(201)
	@Post('register')
	async signUp(
		@Body() signUpDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, accessToken, user } =
			await this.authService.signUpLocale(signUpDto);
		this.setAccessTokenCookie(res, accessToken);
		this.setRefreshTokenCookie(res, refreshToken);
		return this.ok(user, 'User created successfully');
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	async refresh(
		@CurrentUserRefresh() user: JwtRefreshPayloadParams,
		@Res({ passthrough: true }) res: Response,
	) {
		const accessToken = await this.authService.refresh(user);
		this.setAccessTokenCookie(res, accessToken);
	}

	private setAccessTokenCookie(res: Response, accessToken: string) {
		res.cookie(this.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			maxAge: this.env.accessToken.s,
			secure: this.env.nodeEnv === 'production',
			sameSite: 'strict',
		});
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string) {
		res.cookie(this.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			maxAge: this.env.refreshToken.s,
			secure: this.env.nodeEnv === 'production',
			sameSite: 'strict',
		});
	}
}
