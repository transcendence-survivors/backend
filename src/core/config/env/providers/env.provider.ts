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

export interface MinioBucket {
	avatar: string;
	postImage: string;
	postVideo: string;
	commentImage: string;
	commentVideo: string;
}

interface Minio {
	endpoint: string;
	publicEndpoint: string;
	accessKey: string;
	secretKey: string;
	buckets: MinioBucket;
}

type PasswordResetToken = Omit<Token, 'secret'>;

export interface Env {
	accessToken: Token;
	refreshToken: Token;
	passwordResetToken: PasswordResetToken;
	smtp: Smtp;
	minio: Minio;

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

		minio: {
			endpoint: env.MINIO_ENDPOINT,
			publicEndpoint: env.MINIO_PUBLIC_ENDPOINT,
			accessKey: env.MINIO_ROOT_USER,
			secretKey: env.MINIO_ROOT_PASSWORD,
			buckets: {
				avatar: env.MINIO_BUCKET_AVATARS,
				postImage: env.MINIO_BUCKET_POST_IMAGES,
				postVideo: env.MINIO_BUCKET_POST_VIDEOS,
				commentImage: env.MINIO_BUCKET_COMMENT_IMAGES,
				commentVideo: env.MINIO_BUCKET_COMMENT_VIDEOS,
			},
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
