import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PostCreateDto {
	@ApiPropertyOptional({
		description:
			'The text content of the post. \
            Optional, but a post must have at least a content, an image or a quoted post',
		example: 'Hello world!',
		type: String,
	})
	@IsOptional()
	@IsString()
	@MinLength(1)
	@MaxLength(280)
	content?: string;

	@ApiPropertyOptional({
		description:
			'The id of the post this one replies to. \
            When set, the created post is a comment',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
		type: String,
		format: 'uuid',
	})
	@IsOptional()
	@IsString()
	parentPostId?: string;

	@ApiPropertyOptional({
		description:
			'The id of the post being quoted. \
            When set, the created post is a repost with a comment',
		example: 'f6e5d4c3-b2a1-4d5c-9b8a-6d5e4f3a2b1c',
		type: String,
		format: 'uuid',
	})
	@IsOptional()
	@IsString()
	quotedPostId?: string;

	/**
	 * Documented for Swagger only: the file is consumed by the
	 * `FileInterceptor` and never reaches the validation pipe.
	 */
	@ApiPropertyOptional({
		description: 'An image to attach to the post (max 10 MB)',
		type: String,
		format: 'binary',
	})
	file?: unknown;
}
