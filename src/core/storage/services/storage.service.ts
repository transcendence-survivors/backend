import { Injectable } from '@nestjs/common';
import {
	PutObjectCommand,
	DeleteObjectCommand,
	type S3Client,
	DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import {
	InjectS3Client,
	InjectS3InternalClient,
} from '../injects/s3-client.inject';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import { type Env } from '@/core/config/env/providers/env.provider';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageBucket } from '../types/storage-bucket';
import { StoragePresignParams } from '../types/params/storage-presign.params';
import { StoragePresignedUpload } from '../types/records/storage-presigned-upload';
import { MIME_TO_EXTENSION } from '../storage.mime';

@Injectable()
export class StorageService {
	private readonly bucketMap: Record<StorageBucket, string>;

	constructor(
		@InjectS3Client() private readonly s3: S3Client,
		@InjectS3InternalClient() private readonly s3Internal: S3Client,
		@InjectEnv() private readonly env: Env,
	) {
		this.bucketMap = {
			avatar: this.env.minio.buckets.avatar,
			post: this.env.minio.buckets.post,
			chat: this.env.minio.buckets.chat,
		} satisfies Record<StorageBucket, string>;
	}

	async getPresignedUploadUrl({
		contentType,
		contentLength,
		bucket,
		expiresInSeconds = 300,
	}: StoragePresignParams): Promise<StoragePresignedUpload> {
		const bucketName = this.bucketMap[bucket];
		const key = this.buildKey(contentType);

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: contentType,
			ContentLength: contentLength,
		});

		const uploadUrl = await getSignedUrl(this.s3, command, {
			expiresIn: expiresInSeconds,
		});

		return { uploadUrl, publicUrl: this.buildPublicUrl(bucketName, key) };
	}

	async delete(fileUrl: string): Promise<void> {
		const keyData = this.extractBucketAndKeyFromUrl(fileUrl);
		if (!keyData) return;
		try {
			await this.s3Internal.send(
				new DeleteObjectCommand({
					Bucket: keyData.bucketName,
					Key: keyData.key,
				}),
			);
		} catch {
			void 0;
		}
	}
	async deleteMany(fileUrls: string[]): Promise<void> {
		const keysByBucket = new Map<string, string[]>();

		for (const url of fileUrls) {
			const keyData = this.extractBucketAndKeyFromUrl(url);
			if (!keyData) continue;

			const existing = keysByBucket.get(keyData.bucketName) || [];
			keysByBucket.set(keyData.bucketName, [...existing, keyData.key]);
		}

		const deletePromises = Array.from(keysByBucket.entries()).map(
			async ([bucketName, keys]) => {
				try {
					await this.s3Internal.send(
						new DeleteObjectsCommand({
							Bucket: bucketName,
							Delete: {
								Objects: keys.map((Key) => ({ Key })),
							},
						}),
					);
				} catch {
					void 0;
				}
			},
		);

		await Promise.all(deletePromises);
	}

	private buildKey(contentType: string): string {
		const ext = MIME_TO_EXTENSION[contentType];
		const base = randomUUID();
		return ext ? `${base}.${ext}` : base;
	}

	private buildPublicUrl(bucketName: string, key: string): string {
		return `${this.env.minio.publicEndpoint}/${bucketName}/${key}`;
	}

	private extractBucketAndKeyFromUrl(
		fileUrl: string,
	): { bucketName: string; key: string } | null {
		const publicEndpoint = this.env.minio.publicEndpoint;
		if (!fileUrl.startsWith(publicEndpoint)) return null;

		const path = fileUrl.replace(`${publicEndpoint}/`, '');
		const [bucketName, ...keyParts] = path.split('/');
		const key = keyParts.join('/');

		if (!bucketName || !key) return null;
		return { bucketName, key };
	}
}
