import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectEnv } from '@/modules/config/env/inject';
import { type Env } from '@/modules/config/env/env.provider';

export interface JwtAccessPayload {
	sub: string;
	email: string;
	role: string;
	username: string;
}

export interface JwtAccessPayloadParams {
	userId: string;
	email: string;
	role: string;
	username: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: env.accessToken.secret,
		});
	}

	validate({ sub, email, role }: JwtAccessPayload) {
		return {
			userId: sub,
			email,
			role,
		};
	}
}
