import {
	ArrayMaxSize,
	IsArray,
	IsIn,
	IsInt,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ALLOWED_CONTENT_TYPES,
	BUCKET_MAX_SIZE_BYTES,
} from '@/core/storage/storage.mime';

class AvatarStoragePresignDto {
	@ApiProperty({
		description: 'The MIME type of the file to be uploaded',
		example: 'image/jpeg',
		enum: ALLOWED_CONTENT_TYPES.avatar,
	})
	@IsString()
	@IsIn(ALLOWED_CONTENT_TYPES.avatar)
	mimeType!: string;

	@ApiProperty({
		description: 'File size in bytes',
		example: 1048576,
	})
	@IsInt()
	@Min(1)
	@Max(BUCKET_MAX_SIZE_BYTES.avatar, {
		message: `File size cannot exceed ${BUCKET_MAX_SIZE_BYTES.avatar} bytes`,
	})
	contentLength!: number;
}

export class AvatarStoragePresignBatchDto {
	@ApiProperty({
		description:
			'List of file metadata to generate presigned URLs for (max 5)',
		type: [AvatarStoragePresignDto],
	})
	@IsArray()
	@ArrayMaxSize(1)
	@ValidateNested({ each: true })
	@Type(() => AvatarStoragePresignDto)
	files!: AvatarStoragePresignDto[];
}
