import { Injectable } from '@nestjs/common';
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { InjectS3Client } from '../injects/s3-client.inject';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';

@Injectable()
export class StorageService {
	constructor(
		@InjectS3Client() private readonly s3: S3Client,
		@InjectEnv() private readonly env: Env,
	) {}

	async upload(
		key: string,
		body: Buffer,
		contentType: string,
	): Promise<string> {
		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.env.minio.bucket,
				Key: key,
				Body: body,
				ContentType: contentType,
			}),
		);

		return `${this.env.minio.endpoint}/${this.env.minio.bucket}/${key}`;
	}
}
