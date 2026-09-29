import {
	ArrayMaxSize,
	IsArray,
	IsIn,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ALLOWED_CONTENT_TYPES } from '@/core/storage/storage.mime';

class PostStoragePresignDto {
	@ApiProperty({
		description: 'The name of the file to be uploaded',
		example: 'example.jpg',
	})
	@IsString()
	fileName!: string;

	@ApiProperty({
		description: 'The MIME type of the file to be uploaded',
		example: 'image/jpeg',
	})
	@IsString()
	@IsIn(ALLOWED_CONTENT_TYPES.post)
	mimeType!: string;
}

export class PostStoragePresignBatchDto {
	@IsArray()
	@ArrayMaxSize(5)
	@ValidateNested({ each: true })
	@Type(() => PostStoragePresignDto)
	files!: PostStoragePresignDto[];
}
