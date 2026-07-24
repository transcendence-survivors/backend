import { StorageService } from '@/core/storage/services/storage.service';
import { Injectable } from '@nestjs/common';
import { UploadMapper } from '../mapper/upload.mapper';

@Injectable()
export class UploadService {
	constructor(
		private storageService: StorageService,
		private readonly mapper: UploadMapper,
	) {}

	async presignChatMedia(files: { fileName: string; mimeType: string }[]) {
		const presignedUrls = await Promise.all(
			files.map((file) =>
				this.storageService.getPresignedUploadUrl({
					fileName: file.fileName,
					contentType: file.mimeType,
					bucket: 'chat',
				}),
			),
		);
		const fileDtos = this.mapper.toPresignedFilesDtos(presignedUrls);
		return this.mapper.toPresignedFileBatchDto(fileDtos);
	}
}
