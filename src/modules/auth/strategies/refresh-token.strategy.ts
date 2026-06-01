import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { type Env } from '@/modules/config/env/env.provider';
import { InjectEnv } from '@/modules/config/env/inject';

export interface JwtUserRefreshPayload {
	userId: string;
	refreshToken: string;
}

export interface JwtRefreshPayload {
	sub: string;
	refreshToken: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: env.refreshToken.secret,
			passReqToCallback: true,
		});
	}

	validate(req: Request, { sub }: JwtRefreshPayload): JwtUserRefreshPayload {
		const rawToken = req.get('Authorization')?.replace('Bearer', '').trim();
		return {
			userId: sub,
			refreshToken: rawToken as string,
		};
	}
}
