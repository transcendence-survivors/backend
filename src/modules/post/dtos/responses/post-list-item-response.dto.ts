import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PostAuthorResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the author',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		description: 'Username of the author',
		example: 'johndoe',
	})
	@Expose()
	username!: string;

	@ApiProperty({
		type: String,
		description: 'Display name of the author',
		example: 'John Doe',
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		type: String,
		nullable: true,
		description: "URL of the author's avatar image, if set",
		example: 'https://example.com/avatar.jpg',
	})
	@Expose()
	avatarUrl!: string | null;
}

@Exclude()
export class QuotedPostResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the quoted post',
		example: 'c3d4e5f6-a1b2-4c5d-8e9f-2a3b4c5d6e7f',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'Text content of the quoted post',
		example: 'The original post everyone is talking about',
	})
	@Expose()
	content!: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'URL of the image attached to the quoted post, if any',
		example: 'https://cdn.example.com/post-image/abc.png',
	})
	@Expose()
	imageUrl!: string | null;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the quoted post was created',
		example: '2026-07-15T09:32:11.000Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: PostAuthorResponseDto,
		description: 'Author of the quoted post',
	})
	@Expose()
	@Type(() => PostAuthorResponseDto)
	author!: PostAuthorResponseDto;

	@ApiProperty({
		type: Number,
		description: 'Total number of likes on the quoted post',
		example: 42,
	})
	@Expose()
	likeCount!: number;

	@ApiProperty({
		type: Number,
		description: 'Total number of replies to the quoted post',
		example: 7,
	})
	@Expose()
	commentCount!: number;

	@ApiProperty({
		type: Number,
		description: 'Total number of reposts of the quoted post',
		example: 3,
	})
	@Expose()
	repostCount!: number;

	@ApiProperty({
		type: Boolean,
		description: 'Whether the current user liked the quoted post',
		example: false,
	})
	@Expose()
	isLiked!: boolean;

	@ApiProperty({
		type: Boolean,
		description: 'Whether the current user reposted the quoted post',
		example: false,
	})
	@Expose()
	isReposted!: boolean;
}

@Exclude()
export class PostPreviewResponseDto {
	@ApiProperty({
		type: String,
		nullable: true,
		description: 'Text content of the referenced post',
		example: 'The original post everyone is talking about',
	})
	@Expose()
	content!: string | null;

	@ApiProperty({
		type: PostAuthorResponseDto,
		description: 'Author of the referenced post',
	})
	@Expose()
	@Type(() => PostAuthorResponseDto)
	author!: PostAuthorResponseDto;
}

@Exclude()
export class PostListItemResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the post',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'Text content of the post, null for image-only posts',
		example: 'Hello world!',
	})
	@Expose()
	content!: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'URL of the image attached to the post, if any',
		example: 'https://cdn.example.com/post-image/abc.png',
	})
	@Expose()
	imageUrl!: string | null;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the post was created',
		example: '2026-07-15T09:32:11.000Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: PostAuthorResponseDto,
		description: 'Author of the post',
	})
	@Expose()
	@Type(() => PostAuthorResponseDto)
	author!: PostAuthorResponseDto;

	@ApiProperty({
		type: String,
		format: 'uuid',
		nullable: true,
		description:
			'Id of the post this one replies to. Null when the post is a root post',
		example: 'f6e5d4c3-b2a1-4d5c-9b8a-6d5e4f3a2b1c',
	})
	@Expose()
	parentPostId!: string | null;

	@ApiPropertyOptional({
		type: PostPreviewResponseDto,
		nullable: true,
		description: 'Preview of the post this one replies to, if any',
	})
	@Expose()
	@Type(() => PostPreviewResponseDto)
	parent!: PostPreviewResponseDto | null;

	@ApiProperty({
		type: String,
		format: 'uuid',
		nullable: true,
		description: 'Id of the quoted post. Null when the post quotes nothing',
		example: 'c3d4e5f6-a1b2-4c5d-8e9f-2a3b4c5d6e7f',
	})
	@Expose()
	quotedPostId!: string | null;

	@ApiPropertyOptional({
		type: QuotedPostResponseDto,
		nullable: true,
		description:
			'Full preview of the quoted post, including its own engagement stats',
	})
	@Expose()
	@Type(() => QuotedPostResponseDto)
	quotedPost!: QuotedPostResponseDto | null;

	@ApiProperty({
		type: Number,
		description: 'Total number of likes on the post',
		example: 42,
	})
	@Expose()
	likeCount!: number;

	@ApiProperty({
		type: Number,
		description: 'Total number of replies to the post',
		example: 7,
	})
	@Expose()
	commentCount!: number;

	@ApiProperty({
		type: Number,
		description: 'Total number of reposts of the post',
		example: 3,
	})
	@Expose()
	repostCount!: number;

	@ApiProperty({
		type: Boolean,
		description:
			'Whether the current user liked the post. \
            Always false for anonymous requests',
		example: false,
	})
	@Expose()
	isLiked!: boolean;

	@ApiProperty({
		type: Boolean,
		description:
			'Whether the current user reposted the post. \
            Always false for anonymous requests',
		example: false,
	})
	@Expose()
	isReposted!: boolean;
}
