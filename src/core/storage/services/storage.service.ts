import { Injectable } from '@nestjs/common';
import {
	PutObjectCommand,
	DeleteObjectCommand,
	type S3Client,
} from '@aws-sdk/client-s3';
import { InjectS3Client } from '../injects/s3-client.inject';
import { InjectEnv } from '@/core/config/env/injects/env.inject';
import {
	type MinioBucket,
	type Env,
} from '@/core/config/env/providers/env.provider';

type Bucket =
	'avatar' | 'post-image' | 'post-video' | 'comment-image' | 'comment-video';

interface UploadParams {
	fileName: string;
	body: Buffer;
	contentType: string;
	bucket: Bucket;
}

@Injectable()
export class StorageService {
	private readonly bucketMap: Record<Bucket, string>;

	constructor(
		@InjectS3Client() private readonly s3: S3Client,
		@InjectEnv() private readonly env: Env,
	) {
		this.bucketMap = {
			avatar: this.env.minio.buckets.avatar,
			'post-image': this.env.minio.buckets.postImage,
			'post-video': this.env.minio.buckets.postVideo,
			'comment-image': this.env.minio.buckets.commentImage,
			'comment-video': this.env.minio.buckets.commentVideo,
		} satisfies Record<
			Bucket,
			keyof MinioBucket extends never ? string : string
		>;
	}

	async upload({
		body,
		bucket,
		contentType,
		fileName,
	}: UploadParams): Promise<string> {
		const bucketName = this.bucketMap[bucket];

		await this.s3.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: fileName,
				Body: body,
				ContentType: contentType,
			}),
		);

		return `${this.env.minio.publicEndpoint}/${bucketName}/${fileName}`;
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
}
