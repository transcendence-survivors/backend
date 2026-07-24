import { StorageBucket } from '../storage-bucket';

export interface StoragePresignParams {
	fileName: string;
	contentType: string;
	bucket: StorageBucket;
	expiresInSeconds?: number;
}
