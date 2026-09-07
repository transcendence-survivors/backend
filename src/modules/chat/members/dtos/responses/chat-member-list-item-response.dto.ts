import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatMemberRole } from '@prisma-generated/enums';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class ChatMemberUserDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the user',
		example: 'b3f1a2c4-5d6e-4f7a-8b9c-0d1e2f3a4b5c',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		type: String,
		description: 'Display name of the user',
		example: 'John Smith',
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		type: String,
		description: 'Username of the user',
		example: 'johnsmith',
	})
	@Expose()
	username!: string;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: "URL of the user's avatar image, if set",
		example: 'https://cdn.example.com/avatars/john-smith.png',
	})
	@Expose()
	avatarUrl!: string | null;
}

@Exclude()
export class ChatMemberListItemResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the chat member record',
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
		enum: ChatMemberRole,
		description: 'Role of the member in the chat room',
		example: ChatMemberRole.MEMBER,
	})
	@Expose()
	role!: ChatMemberRole;

	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Timestamp when the user joined the room',
		example: '2023-01-01T12:00:00Z',
	})
	@Expose()
	joinedAt!: Date;

	@ApiProperty({
		type: ChatMemberUserDto,
		description: 'User details of the chat member',
	})
	@Expose()
	@Type(() => ChatMemberUserDto)
	user!: ChatMemberUserDto;
}
