import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatMemberRole, ChatMessageType } from '@prisma-generated/enums';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
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

	@ApiProperty({
		enum: ChatMemberRole,
		enumName: 'ChatMemberRole',
		description: 'Role of the message sender within the room',
		example: ChatMemberRole.MEMBER,
	})
	@Expose()
	role!: ChatMemberRole | null;
}

@Exclude()
class SharedPostAuthorDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the post author',
		example: 'c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		description: 'Username of the post author',
		example: 'johndoe',
	})
	@Expose()
	username!: string;

	@ApiProperty({
		type: String,
		description: 'Display name of the post author',
		example: 'John Doe',
	})
	@Expose()
	displayName!: string;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: "URL of the author's avatar image, if set",
		example: 'https://cdn.example.com/avatars/john-doe.png',
	})
	@Expose()
	avatarUrl!: string | null;
}

@Exclude()
export class SharedPostDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the shared post',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@Expose()
	id!: string;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'Text content of the shared post',
		example: 'Check out this interesting article!',
	})
	@Expose()
	content!: string | null;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'Image URL associated with the shared post, if any',
		example: 'https://cdn.example.com/posts/image.png',
	})
	@Expose()
	imageUrl!: string | null;

	@ApiProperty({
		type: String,
		description: 'Type or category of the shared post',
		example: 'ARTICLE',
	})
	@Expose()
	type!: string;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the post was created',
		example: '2026-01-01T12:00:00Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		type: SharedPostAuthorDto,
		description: 'Author details of the shared post',
	})
	@Expose()
	@Type(() => SharedPostAuthorDto)
	author!: SharedPostAuthorDto;
}

@Exclude()
export class ChatMessageMetadataDto {
	@ApiPropertyOptional({
		enum: ChatMemberRole,
		nullable: true,
		description: 'Previous role of the target member (for role updates)',
		example: ChatMemberRole.MEMBER,
	})
	@Expose()
	oldRole!: ChatMemberRole | null;

	@ApiPropertyOptional({
		enum: ChatMemberRole,
		nullable: true,
		description:
			'New role assigned to the target member (for role updates)',
		example: ChatMemberRole.ADMIN,
	})
	@Expose()
	newRole!: ChatMemberRole | null;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'Previous property value (e.g., previous room title)',
		example: 'Old Room Name',
	})
	@Expose()
	oldValue!: string | null;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'New property value (e.g., updated room title)',
		example: 'New Room Name',
	})
	@Expose()
	newValue!: string | null;

	@ApiPropertyOptional({
		type: ChatMessageSenderDto,
		nullable: true,
		description:
			'Target user affected by the system event (e.g., kicked or role-updated member)',
	})
	@Expose()
	@Type(() => ChatMessageSenderDto)
	targetUser!: ChatMessageSenderDto | null;
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
		format: 'uuid',
		description: 'Unique identifier of the chat room',
		example: 'f1e2d3c4-b5a6-4b7c-8d9e-0f1a2b3c4d5e',
	})
	@Expose()
	roomId!: string;

	@ApiProperty({
		enum: ChatMessageType,
		description:
			'Type of the message (standard text, post share, or system event)',
		example: ChatMessageType.TEXT,
	})
	@Expose()
	type!: ChatMessageType;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'Content of the chat message (null for system messages)',
		example: 'Hello, friend!',
	})
	@Expose()
	content!: string | null;

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
		description: 'Unique identifier of the message replied to, if any',
		example: 'd4c3b2a1-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	replyToId!: string | null;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the chat message was created',
		example: '2026-01-01T12:00:00Z',
	})
	@Expose()
	createdAt!: Date;

	@ApiPropertyOptional({
		type: ChatMessageSenderDto,
		nullable: true,
		description:
			'The actor/sender of the message (null if automated system message)',
	})
	@Expose()
	@Type(() => ChatMessageSenderDto)
	sender!: ChatMessageSenderDto | null;

	@ApiPropertyOptional({
		type: SharedPostDto,
		nullable: true,
		description: 'Attached shared post data, if message type is POST_SHARE',
	})
	@Expose()
	@Type(() => SharedPostDto)
	sharedPost!: SharedPostDto | null;

	@ApiPropertyOptional({
		type: ChatMessageMetadataDto,
		nullable: true,
		description: 'Event-specific metadata attached to system messages',
	})
	@Expose()
	@Type(() => ChatMessageMetadataDto)
	metadata!: ChatMessageMetadataDto | null;
}
