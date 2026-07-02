import { Module } from '@nestjs/common';
import { S3ClientProvider } from './providers/s3-client.provider';
import { StorageService } from './services/storage.service';

@Module({
	providers: [S3ClientProvider, StorageService],
	exports: [StorageService],
})
export class StorageModule {}
