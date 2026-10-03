import { StorageService } from '@/core/storage/services/storage.service';
import { Injectable } from '@nestjs/common';
import { UploadMapper } from '../mapper/upload.mapper';
import { StorageBucket } from '@/core/storage/types/storage-bucket';

@Injectable()
export class UploadService {
	constructor(
		private storageService: StorageService,
		private readonly mapper: UploadMapper,
	) {}

	async presignAttachements(
		files: { mimeType: string; contentLength: number }[],
		bucket: StorageBucket,
	) {
		const presignedUrls = await Promise.all(
			files.map((file) =>
				this.storageService.getPresignedUploadUrl({
					contentType: file.mimeType,
					contentLength: file.contentLength,
					bucket,
				}),
			),
		);
		const fileDtos = this.mapper.toPresignedFilesDtos(presignedUrls);
		return this.mapper.toPresignedFileBatchDto(fileDtos);
	}
}
