import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { type Env } from '@/modules/config/env/env';
import { InjectEnv } from '@/modules/config/env/inject';

interface RefreshTokenPayload {
	sub: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: env.JWT_REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		});
	}

	validate(req: Request, { sub }: RefreshTokenPayload) {
		const rawToken = req.get('Authorization')?.replace('Bearer', '').trim();
		return {
			userId: sub,
			refreshToken: rawToken,
		};
	}
}
