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

class PostStoragePresignDto {
	@ApiProperty({
		description: 'The MIME type of the file to be uploaded',
		example: 'image/jpeg',
		enum: ALLOWED_CONTENT_TYPES.post,
	})
	@IsString()
	@IsIn(ALLOWED_CONTENT_TYPES.post)
	mimeType!: string;

	@ApiProperty({
		description: 'File size in bytes',
		example: 1048576,
	})
	@IsInt()
	@Min(1)
	@Max(BUCKET_MAX_SIZE_BYTES.post, {
		message: `File size cannot exceed ${BUCKET_MAX_SIZE_BYTES.post} bytes`,
	})
	contentLength!: number;
}

export class PostStoragePresignBatchDto {
	@ApiProperty({
		description:
			'List of file metadata to generate presigned URLs for (max 5)',
		type: [PostStoragePresignDto],
	})
	@IsArray()
	@ArrayMaxSize(1)
	@ValidateNested({ each: true })
	@Type(() => PostStoragePresignDto)
	files!: PostStoragePresignDto[];
}
