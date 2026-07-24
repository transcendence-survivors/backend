import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PostCreatedResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the freshly created post',
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
		format: 'uuid',
		description: 'Id of the user who created the post',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@Expose()
	authorId!: string;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the post was created',
		example: '2026-07-15T09:32:11.000Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: String,
		format: 'uuid',
		nullable: true,
		description: 'Id of the post this one replies to, if any',
		example: 'f6e5d4c3-b2a1-4d5c-9b8a-6d5e4f3a2b1c',
	})
	@Expose()
	parentPostId!: string | null;

	@ApiProperty({
		type: String,
		format: 'uuid',
		nullable: true,
		description: 'Id of the post this one quotes, if any',
		example: 'c3d4e5f6-a1b2-4c5d-8e9f-2a3b4c5d6e7f',
	})
	@Expose()
	quotedPostId!: string | null;
}
