import { Module } from '@nestjs/common';
import {
	S3ClientProvider,
	S3InternalClientProvider,
} from './providers/s3-client.provider';
import { StorageService } from './services/storage.service';

@Module({
	providers: [S3ClientProvider, S3InternalClientProvider, StorageService],
	exports: [StorageService],
})
export class StorageModule {}
