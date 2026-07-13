import * as z from 'zod';

const envSchema = z.object({
	JWT_REFRESH_TOKEN_SECRET: z.string().min(10),
	JWT_ACCESS_TOKEN_SECRET: z.string().min(10),

	JWT_REFRESH_TOKEN_EXPIRATION_S: z.coerce.number().min(60),
	JWT_ACCESS_TOKEN_EXPIRATION_S: z.coerce.number().min(60),
	RESET_PASSWORD_TOKEN_EXPIRATION_S: z.coerce.number().min(60),

	DATABASE_URL: z.url(),
	FRONTEND_URL: z.url(),
	NODE_ENV: z.enum(['development', 'production']),
	NEST_PORT: z.coerce.number().min(1).max(65535),

	SMTP_HOST: z.string().min(1),
	SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
	SMTP_USER: z.string().min(1),
	SMTP_PASS: z.string().min(1),
	SMTP_FROM_EMAIL: z.email(),
	SMTP_FROM_NAME: z.string().min(1),

	MINIO_ENDPOINT: z.url(),
	MINIO_PUBLIC_ENDPOINT: z.url(),
	MINIO_ROOT_USER: z.string().min(1),
	MINIO_ROOT_PASSWORD: z.string().min(1),
	MINIO_BUCKET_AVATARS: z.string().min(1),
	MINIO_BUCKET_POST_IMAGES: z.string().min(1),
	MINIO_BUCKET_POST_VIDEOS: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
