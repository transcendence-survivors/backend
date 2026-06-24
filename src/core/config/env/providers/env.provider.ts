import { type Provider } from '@nestjs/common';
import env from '../schemas/env.schema';

interface Token {
	secret: string;
	ms: number;
	s: number;
}

interface Smtp {
	host: string;
	port: number;
	user: string;
	pass: string;
	emailFrom: string;
	nameFrom: string;
}

type PasswordResetToken = Omit<Token, 'secret'>;

export interface Env {
	accessToken: Token;
	refreshToken: Token;
	passwordResetToken: PasswordResetToken;
	smtp: Smtp;

	frontEndUrl: string;
	databaseUrl: string;
	nodeEnv: 'development' | 'production';
	port: number;
}

export const ENV = Symbol('ENV');

export const EnvProvider: Provider<Env> = {
	provide: ENV,
	useValue: {
		smtp: {
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			user: env.SMTP_USER,
			pass: env.SMTP_PASS,
			emailFrom: env.SMTP_FROM_EMAIL,
			nameFrom: env.SMTP_FROM_NAME,
		},

		accessToken: {
			secret: env.JWT_ACCESS_TOKEN_SECRET,
			ms: env.JWT_ACCESS_TOKEN_EXPIRATION_S * 1000,
			s: env.JWT_ACCESS_TOKEN_EXPIRATION_S,
		},
		refreshToken: {
			secret: env.JWT_REFRESH_TOKEN_SECRET,
			ms: env.JWT_REFRESH_TOKEN_EXPIRATION_S * 1000,
			s: env.JWT_REFRESH_TOKEN_EXPIRATION_S,
		},
		passwordResetToken: {
			ms: env.RESET_PASSWORD_TOKEN_EXPIRATION_S * 1000,
			s: env.RESET_PASSWORD_TOKEN_EXPIRATION_S,
		},
		frontEndUrl: env.FRONTEND_URL,
		databaseUrl: env.DATABASE_URL,
		nodeEnv: env.NODE_ENV,
		port: env.NEST_PORT,
	},
};
