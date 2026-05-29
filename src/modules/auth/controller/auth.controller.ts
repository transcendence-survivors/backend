import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import CreateUserDto from '@/modules/user/dto/create.dto';
import { type Response } from 'express';
import { BaseController } from '@/common/base.controller';
import { SignInDto } from '@/modules/user/dto/signin.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController extends BaseController {
	private readonly REFRESH_TOKEN = 'refreshToken';
	private readonly ACCESS_TOKEN = 'accessToken';
	constructor(
		private authService: AuthService,
		private configService: ConfigService,
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
		res.cookie(this.REFRESH_TOKEN, refreshToken);
		res.cookie(this.ACCESS_TOKEN, accessToken);
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
		// res.cookie(this.REFRESH_TOKEN, refreshToken, {
		// 	httpOnly: true,
		// });
		// res.cookie(this.ACCESS_TOKEN, accessToken, {
		// 	httpOnly: true,
		// });
		this.setAccessTokenCookie(res, accessToken);
		this.setRefreshTokenCookie(res, refreshToken);
		return this.ok(user, 'User created successfully');
	}

	private setAccessTokenCookie(res: Response, accessToken: string) {
		res.cookie(this.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			maxAge: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
		});
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string) {
		res.cookie(this.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
		});
	}
}
