import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const GAME_SERVER_KEY = 'game-server-jwt';

export interface GameServerPayload {
	serverId: string;
	type: 'game-server';
	iat?: number;
	exp?: number;
}

@Injectable()
export class JWTGameStrategy extends PassportStrategy(
	Strategy,
	GAME_SERVER_KEY,
) {
	constructor(@InjectEnv() readonly env: Env) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: env.gameSecret,
			ignoreExpiration: false,
		});
	}

	validate(payload: GameServerPayload): GameServerPayload {
		if (payload.type !== 'game-server') {
			throw new UnauthorizedException(
				'Token is not valid for game server access',
			);
		}
		return payload;
	}
}
