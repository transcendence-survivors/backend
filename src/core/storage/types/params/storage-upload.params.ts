import { StorageBucket } from '../storage-bucket';

export interface StorageUploadParams {
	fileName: string;
	body: Buffer;
	contentType: string;
	bucket: StorageBucket;
}
