import { type Provider } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ENV, type Env } from '@/core/config/env/providers/env.provider';

export const S3_CLIENT = Symbol('S3_CLIENT');

export const S3ClientProvider: Provider<S3Client> = {
	provide: S3_CLIENT,
	inject: [ENV],
	useFactory: (env: Env) =>
		new S3Client({
			endpoint: env.minio.endpoint,
			region: 'us-east-1',
			forcePathStyle: true,
			credentials: {
				accessKeyId: env.minio.accessKey,
				secretAccessKey: env.minio.secretKey,
			},
		}),
};
