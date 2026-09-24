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

class ChatStoragePresignDto {
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
	@IsIn(ALLOWED_CONTENT_TYPES.chat)
	mimeType!: string;
}

export class ChatStoragePresignBatchDto {
	@IsArray()
	@ArrayMaxSize(5)
	@ValidateNested({ each: true })
	@Type(() => ChatStoragePresignDto)
	files!: ChatStoragePresignDto[];
}
