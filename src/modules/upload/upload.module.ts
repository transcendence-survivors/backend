import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { UploadMapper } from './mapper/upload.mapper';
import { UploadService } from './services/upload.service';

@Module({
	imports: [],
	controllers: [UploadController],
	providers: [UploadService, UploadMapper],
})
export class UploadModule {}
