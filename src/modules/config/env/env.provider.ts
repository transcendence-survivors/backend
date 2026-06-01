import { type Provider } from '@nestjs/common';
import env from './env';

interface Token {
	secret: string;
	ms: number;
	s: number;
}

export interface Env {
	accessToken: Token;
	refreshToken: Token;
	databaseUrl: string;
	nodeEnv: 'development' | 'production';
}

export const ENV = Symbol('ENV');

export const EnvProvider: Provider<Env> = {
	provide: ENV,
	useValue: {
		accessToken: {
			secret: env.JWT_ACCESS_TOKEN_SECRET,
			ms: env.JWT_ACCESS_TOKEN_EXPIRATION,
			s: env.JWT_ACCESS_TOKEN_EXPIRATION,
		},
		refreshToken: {
			secret: env.JWT_REFRESH_TOKEN_SECRET,
			ms: env.JWT_REFRESH_TOKEN_EXPIRATION,
			s: env.JWT_REFRESH_TOKEN_EXPIRATION,
		},
		databaseUrl: env.DATABASE_URL,
		nodeEnv: env.NODE_ENV,
	},
};
