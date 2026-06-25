import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { type Request } from 'express';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';

export const JWT_ACCESS_TOKEN_KEY = 'jwt-access-token';

@Injectable()
export class JWTAccessStrategy extends PassportStrategy(
	Strategy,
	JWT_ACCESS_TOKEN_KEY,
) {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req?.cookies?.accessToken as string,
			]),
			secretOrKey: env.accessToken.secret,
		});
	}

	validate(payload: JwtAccessPayload): JwtAccessPayload {
		return payload;
	}
}
