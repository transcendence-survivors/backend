import * as z from 'zod';

const envSchema = z.object({
	JWT_REFRESH_TOKEN_SECRET: z.string().min(10),
	JWT_REFRESH_TOKEN_EXPIRATION: z.coerce.number().min(60),
	JWT_ACCESS_TOKEN_SECRET: z.string().min(10),
	JWT_ACCESS_TOKEN_EXPIRATION: z.coerce.number().min(60),
	DATABASE_URL: z.url(),
	NODE_ENV: z.enum(['development', 'production']),
});

const env = envSchema.parse(process.env);

export default env;
