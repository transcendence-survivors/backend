import { Injectable } from '@nestjs/common';
import {
	PutObjectCommand,
	DeleteObjectCommand,
	type S3Client,
} from '@aws-sdk/client-s3';
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
		return `${this.env.minio.publicEndpoint}/${this.env.minio.bucket}/${key}`;
	}

	async delete(fileUrl: string): Promise<void> {
		const prefix = `${this.env.minio.publicEndpoint}/${this.env.minio.bucket}/`;
		const key = fileUrl.replace(prefix, '');
		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: this.env.minio.bucket,
				Key: key,
			}),
		);
	}
}
