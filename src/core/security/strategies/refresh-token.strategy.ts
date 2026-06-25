import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { type JwtRefreshPayload } from '../interfaces/jwt-payload.interface';

export const JWT_REFRESH_TOKEN_KEY = 'jwt-refresh';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	JWT_REFRESH_TOKEN_KEY,
) {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req?.cookies?.refreshToken as string,
			]),
			secretOrKey: env.refreshToken.secret,
			passReqToCallback: true,
		});
	}

	validate(
		req: Request,
		{ sub, ...rest }: JwtRefreshPayload,
	): JwtRefreshPayload {
		console.log('RefreshTokenStrategy.validate', {
			sub,
			rest,
			cookies: req.cookies,
		});
		return {
			sub,
			refreshToken: req.cookies?.refreshToken as string,
		};
	}
}
