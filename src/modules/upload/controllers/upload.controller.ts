import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { UserStoragePresignBatchDto } from '../dtos/requests/user-storage-presign.dto';
import { PostStoragePresignBatchDto } from '../dtos/requests/post-storage-presign.dto';
import { ChatStoragePresignBatchDto } from '../dtos/requests/chat-storage-presign.dto';

@UseGuards(JWTAccessGuard)
@Controller('uploads')
export class UploadController {
	constructor(private uploadService: UploadService) {}

	@Post('chat-presign')
	@HttpCode(HttpStatus.OK)
	async presignChatMedia(@Body() dto: ChatStoragePresignBatchDto) {
		return this.uploadService.presignAttachements(dto.files, 'chat');
	}

	@Post('user-presign')
	@HttpCode(HttpStatus.OK)
	async presignUserMedia(@Body() dto: UserStoragePresignBatchDto) {
		return this.uploadService.presignAttachements(dto.files, 'avatar');
	}

	@Post('post-presign')
	@HttpCode(HttpStatus.OK)
	async presignPostMedia(@Body() dto: PostStoragePresignBatchDto) {
		return this.uploadService.presignAttachements(dto.files, 'post');
	}
}
