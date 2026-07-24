import { Injectable } from '@nestjs/common';
import {
	UploadPresignedFileListItemResponseDto,
	UploadPresignedFileBatchResponseDto,
} from '../dtos/responses/upload-presigned-file-response.dto';
import { plainToInstance } from 'class-transformer';
import { StoragePresignedUpload } from '@/core/storage/types/records/storage-presigned-upload';

@Injectable()
export class UploadMapper {
	toPresignedFileListItemDto(
		file: StoragePresignedUpload,
	): UploadPresignedFileListItemResponseDto {
		return plainToInstance(UploadPresignedFileListItemResponseDto, file, {
			excludeExtraneousValues: true,
		});
	}

	toPresignedFilesDtos(
		files: StoragePresignedUpload[],
	): UploadPresignedFileListItemResponseDto[] {
		return files.map((file) => this.toPresignedFileListItemDto(file));
	}

	toPresignedFileBatchDto(
		filesDtos: UploadPresignedFileListItemResponseDto[],
	): UploadPresignedFileBatchResponseDto {
		return plainToInstance(
			UploadPresignedFileBatchResponseDto,
			{ files: filesDtos },
			{ excludeExtraneousValues: true },
		);
	}
}
