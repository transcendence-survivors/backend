import {
	applyDecorators,
	Body,
	Controller,
	Get,
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
import { TokenService } from '@/modules/token/service/token.service';
import { RolesGuard } from '@/modules/token/guards/roles.guard';
import { Roles } from '@/common/decorators/role.decorator';
import { UserRole } from '@prisma-generated/enums';
import { AccessTokenGuard } from '@/modules/token/guards/access-token.guard';

const Test = (...roles: UserRole[]) =>
	applyDecorators(Roles(...roles), UseGuards(AccessTokenGuard, RolesGuard));

@Controller('auth')
export class AuthController extends BaseController {
	private readonly REFRESH_TOKEN = 'refreshToken';
	private readonly ACCESS_TOKEN = 'accessToken';
	constructor(
		private authService: AuthService,
		private tokenService: TokenService,
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

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Post('logout')
	async logout(
		@CurrentUserRefresh() user: JwtRefreshPayloadParams,
		@Res({ passthrough: true }) res: Response,
	) {
		await this.tokenService.logout(user);
		res.clearCookie(this.REFRESH_TOKEN);
		res.clearCookie(this.ACCESS_TOKEN);
	}

	@Get('test')
	@Test(UserRole.ADMIN)
	test() {
		return this.ok('BENOIT');
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
