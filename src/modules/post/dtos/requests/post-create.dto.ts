import { ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator';

export class PostCreateDto {
	@ApiPropertyOptional({
		type: String,
		description: 'Text content of the post',
		example: 'Hello world!',
	})
	@IsOptional()
	@IsString()
	@ValidateIf(
		(o: PostCreateDto) =>
			o.content !== undefined && o.content !== '' && o.content !== null,
	)
	@MinLength(1)
	@MaxLength(280)
	content?: string;

	@ApiPropertyOptional({
		type: String,
		description: 'Presigned S3 object URL after direct upload',
		example: 'https://your-bucket.s3.amazonaws.com/posts/image.png',
	})
	@IsOptional()
	@IsUrl({ require_tld: false })
	imageUrl?: string;

	@ApiPropertyOptional({
		type: String,
		format: 'uuid',
		description: 'ID of parent post if this is a reply',
	})
	@IsOptional()
	@IsUUID()
	parentPostId?: string;

	@ApiPropertyOptional({
		type: String,
		format: 'uuid',
		description: 'ID of quoted post if this is a quote',
	})
	@IsOptional()
	@IsUUID()
	quotedPostId?: string;
}
