import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { PrismaService } from '@/core/database/services/prisma.service';

export const JWT_ACCESS_TOKEN_KEY = 'jwt-access-token';

@Injectable()
export class JWTAccessStrategy extends PassportStrategy(
	Strategy,
	JWT_ACCESS_TOKEN_KEY,
) {
	constructor(
		@InjectEnv() readonly env: Env,
		private readonly prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					if (!req?.cookies) return null;
					const accessToken: unknown = req.cookies?.accessToken;
					return typeof accessToken === 'string' ? accessToken : null;
				},
			]),
			secretOrKey: env.accessToken.secret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: JwtAccessPayload): Promise<JwtAccessPayload> {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true },
		});

		if (!user)
			throw new UnauthorizedException('User account no longer exists');
		return payload;
	}
}

@Injectable()
export class WsJWTAccessStrategy {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		@InjectEnv() readonly env: Env,
	) {}

	async validateSocket(client: Socket): Promise<JwtAccessPayload> {
		const rawCookieHeader = client.handshake.headers.cookie;

		if (!rawCookieHeader) {
			throw new WsException('Missing credentials cookie');
		}

		const cookies = parseCookie(rawCookieHeader);
		const token = cookies.accessToken;

		if (!token) {
			throw new WsException('Access token not found in cookies');
		}

		let payload: JwtAccessPayload;
		try {
			payload = this.jwtService.verify<JwtAccessPayload>(token, {
				secret: this.env.accessToken.secret,
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Unauthorized';
			throw new WsException(
				`Invalid or expired access token: ${message}`,
			);
		}
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true },
		});
		if (!user) throw new WsException('User account no longer exists');
		return payload;
	}
}
