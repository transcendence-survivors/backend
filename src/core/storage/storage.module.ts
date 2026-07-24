import { Module } from '@nestjs/common';
import {
	S3ClientProvider,
	S3PublicClientProvider,
} from './providers/s3-client.provider';
import { StorageService } from './services/storage.service';

@Module({
	providers: [S3ClientProvider, S3PublicClientProvider, StorageService],
	exports: [StorageService],
})
export class StorageModule {}
