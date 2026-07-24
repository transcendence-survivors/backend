import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UploadPresignedFileListItemResponseDto {
	@ApiProperty({
		type: String,
		description: 'The URL to upload the file to',
		example: 'https://storage.example.com/upload/abc123',
	})
	@Expose()
	uploadUrl!: string;

	@ApiProperty({
		type: String,
		description: 'The public URL of the uploaded file',
		example: 'https://cdn.example.com/files/abc123',
	})
	@Expose()
	publicUrl!: string;
}

export class UploadPresignedFileBatchResponseDto {
	@ApiProperty({
		type: [UploadPresignedFileListItemResponseDto],
		description: 'List of presigned file upload responses',
	})
	@Type(() => UploadPresignedFileListItemResponseDto)
	@Expose()
	files!: UploadPresignedFileListItemResponseDto[];
}
