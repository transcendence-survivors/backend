import { StorageBucket } from '../storage-bucket';

export interface StoragePresignParams {
	contentType: string;
	contentLength: number;
	bucket: StorageBucket;
	expiresInSeconds?: number;
}
