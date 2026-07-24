import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StoragePresignBatchDto } from '../dtos/requests/upload-presign.dto';
import { UploadService } from '../services/upload.service';

@UseGuards(JWTAccessGuard)
@Controller('uploads')
export class UploadController {
	constructor(private uploadService: UploadService) {}

	@Post('chat-presign')
	@HttpCode(200)
	async presignChatMedia(@Body() dto: StoragePresignBatchDto) {
		return this.uploadService.presignChatMedia(dto.files);
	}
}
