import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { type Env } from '@/core/config/env/providers/env.provider';
import { InjectEnv } from '@/core/config/env/injects/env.inject';

export interface JwtRefreshPayloadParams {
	userId: string;
	refreshToken: string;
}

export type JwtRefreshPayload = Omit<JwtRefreshPayloadParams, 'userId'> & {
	sub: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
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
		{ sub }: JwtRefreshPayload,
	): JwtRefreshPayloadParams {
		return {
			userId: sub,
			refreshToken: req.cookies?.refreshToken as string,
		};
	}
}
