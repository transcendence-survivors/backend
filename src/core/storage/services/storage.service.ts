import { BadRequestException, Injectable } from '@nestjs/common';
import {
	PutObjectCommand,
	DeleteObjectCommand,
	type S3Client,
} from '@aws-sdk/client-s3';
import {
	InjectS3Client,
	InjectS3PublicClient,
} from '../injects/s3-client.inject';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageUploadParams } from '../types/params/storage-upload.params';
import { StorageBucket } from '../types/storage-bucket';
import { StoragePresignParams } from '../types/params/storage-presign.params';
import { StoragePresignedUpload } from '../types/records/storage-presigned-upload';
import { ALLOWED_CONTENT_TYPES } from '../storage.mime';

@Injectable()
export class StorageService {
	private readonly bucketMap: Record<StorageBucket, string>;

	constructor(
		@InjectS3Client() private readonly s3: S3Client,
		@InjectS3PublicClient() private readonly publicS3: S3Client,
		@InjectEnv() private readonly env: Env,
	) {
		this.bucketMap = {
			avatar: this.env.minio.buckets.avatar,
			post: this.env.minio.buckets.post,
			chat: this.env.minio.buckets.chat,
		} satisfies Record<StorageBucket, string>;
	}

	async upload({
		body,
		bucket,
		contentType,
		fileName,
	}: StorageUploadParams): Promise<string> {
		this.assertContentTypeAllowed(bucket, contentType);
		const bucketName = this.bucketMap[bucket];
		const key = this.buildKey(fileName);

		await this.s3.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: body,
				ContentType: contentType,
			}),
		);

		return this.buildPublicUrl(bucketName, key);
	}

	async getPresignedUploadUrl({
		fileName,
		contentType,
		bucket,
		expiresInSeconds = 300,
	}: StoragePresignParams): Promise<StoragePresignedUpload> {
		this.assertContentTypeAllowed(bucket, contentType);
		const bucketName = this.bucketMap[bucket];
		const key = this.buildKey(fileName);

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(this.publicS3, command, {
			expiresIn: expiresInSeconds,
		});

		return { uploadUrl, publicUrl: this.buildPublicUrl(bucketName, key) };
	}

	async delete(fileUrl: string): Promise<void> {
		const prefix = `${this.env.minio.publicEndpoint}/`;
		const path = fileUrl.replace(prefix, '');
		const [bucketName, ...keyParts] = path.split('/');
		const key = keyParts.join('/');

		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: bucketName,
				Key: key,
			}),
		);
	}
	async deleteMany(fileUrls: string[]): Promise<void> {
		const prefix = `${this.env.minio.publicEndpoint}/`;
		const deleteCommands = fileUrls.map((fileUrl) => {
			const path = fileUrl.replace(prefix, '');
			const [bucketName, ...keyParts] = path.split('/');
			const key = keyParts.join('/');

			return new DeleteObjectCommand({
				Bucket: bucketName,
				Key: key,
			});
		});

		await Promise.all(deleteCommands.map((cmd) => this.s3.send(cmd)));
	}

	private buildKey(fileName: string): string {
		const ext = fileName.includes('.')
			? fileName.split('.').pop()
			: undefined;
		const base = randomUUID();
		return ext ? `${base}.${ext}` : base;
	}

	private buildPublicUrl(bucketName: string, key: string): string {
		return `${this.env.minio.publicEndpoint}/${bucketName}/${key}`;
	}

	private assertContentTypeAllowed(
		bucket: StorageBucket,
		contentType: string,
	): void {
		if (!ALLOWED_CONTENT_TYPES[bucket].includes(contentType)) {
			throw new BadRequestException(
				`Content type "${contentType}" not allowed for bucket "${bucket}"`,
			);
		}
	}
}
