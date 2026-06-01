import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectEnv } from '@/modules/config/env/inject';
import { type Env } from '@/modules/config/env/env';

interface AccessTokenPayload {
	sub: string;
	email: string;
	role: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: env.JWT_ACCESS_TOKEN_SECRET,
		});
	}

	validate({ sub, email, role }: AccessTokenPayload) {
		return {
			userId: sub,
			email,
			role,
		};
	}
}
