import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

class ChatMessageSenderDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the member',
		example: 'b3f1a2c4-5d6e-4f7a-8b9c-0d1e2f3a4b5c',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		description: 'Display name of the member',
		example: 'John Smith',
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		type: String,
		description: 'Username of the member',
		example: 'johnsmith',
	})
	@Expose()
	username!: string;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: "URL of the member's avatar image, if set",
		example: 'https://cdn.example.com/avatars/john-smith.png',
	})
	@Expose()
	avatarUrl!: string | null;
}

@Exclude()
export class ChatMessageListItemResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the chat message',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		description: 'Content of the chat message',
		example: 'Hello, friend!',
	})
	@Expose()
	content!: string;

	@ApiProperty({
		type: ChatMessageSenderDto,
		description: 'The sender of the chat message',
	})
	@Expose()
	@Type(() => ChatMessageSenderDto)
	sender!: ChatMessageSenderDto;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the chat message was created',
		example: '2023-01-01T12:00:00Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: Boolean,
		description: 'Indicates if the chat message has been edited',
		example: false,
	})
	@Expose()
	isEdited!: boolean;

	@ApiProperty({
		type: Boolean,
		description: 'Indicates if the chat message has been deleted',
		example: false,
	})
	@Expose()
	isDeleted!: boolean;

	@ApiPropertyOptional({
		type: String,
		format: 'uuid',
		nullable: true,
		description:
			'Unique identifier of the chat message this message is replying to, if any',
		example: 'd4c3b2a1-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	replyToId!: string | null;

	@ApiPropertyOptional({
		type: [String],
		description:
			'List of URLs for attachments associated with the chat message',
		example: [
			'https://cdn.example.com/attachments/file1.png',
			'https://cdn.example.com/attachments/file2.pdf',
		],
	})
	@Expose()
	attachmentUrls!: string[];
}
