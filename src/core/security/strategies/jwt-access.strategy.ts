import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { type Request } from 'express';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parseCookie } from 'cookie';

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

@Injectable()
export class WsJWTAccessStrategy {
	constructor(
		private readonly jwtService: JwtService,
		@InjectEnv() readonly env: Env,
	) {}

	validateSocket(client: Socket): JwtAccessPayload {
		const rawCookieHeader = client.handshake.headers.cookie;

		if (!rawCookieHeader) {
			throw new WsException('Missing credentials cookie');
		}

		const cookies = parseCookie(rawCookieHeader);
		const token = cookies.accessToken;

		if (!token) {
			throw new WsException('Access token not found in cookies');
		}

		try {
			return this.jwtService.verify<JwtAccessPayload>(token, {
				secret: this.env.accessToken.secret,
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Unauthorized';
			throw new WsException(
				`Invalid or expired access token: ${message}`,
			);
		}
	}
}
