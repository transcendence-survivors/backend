import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { UploadMapper } from './mapper/upload.mapper';
import { UploadService } from './services/upload.service';
import { UploadListener } from './listeners/upload.listener';

@Module({
	imports: [],
	controllers: [UploadController],
	providers: [UploadService, UploadMapper, UploadListener],
})
export class UploadModule {}
