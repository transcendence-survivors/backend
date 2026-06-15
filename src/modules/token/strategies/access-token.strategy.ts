import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectEnv } from '@/modules/env/injects/env.inject';
import { type Env } from '@/modules/env/providers/env.provider';
import { UserRole } from '@prisma-generated/enums';
import { type Request } from 'express';

export interface JwtAccessPayload {
	sub: string;
	email: string;
	role: UserRole;
	username: string;
}

export type JwtAccessPayloadParams = Omit<JwtAccessPayload, 'sub'> & {
	userId: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req?.cookies?.accessToken as string,
			]),
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
