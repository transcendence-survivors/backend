import { ChatMessageListItemResponseDto } from '@/modules/chat/message/dtos/responses/chat-room-list-item-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomType } from '@prisma-generated/enums';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class ChatRoomMemberDto {
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
export class ChatRoomListItemResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique identifier of the chat room',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		enum: ChatRoomType,
		enumName: 'ChatRoomType',
		description: 'Type of the chat room: a 1-to-1 conversation or a group',
		example: ChatRoomType.DIRECT,
	})
	@Expose()
	type!: ChatRoomType;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description:
			'Name of the room. Typically null for DIRECT rooms and set for GROUP rooms',
		example: 'Weekend Trip Planning',
	})
	@Expose()
	name!: string | null;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description:
			"URL of the room avatar image. For DIRECT rooms this is usually null, with the UI falling back to the other member's avatar",
		example: 'https://cdn.example.com/rooms/weekend-trip.png',
	})
	@Expose()
	avatarUrl!: string | null;

	@ApiPropertyOptional({
		type: ChatMessageListItemResponseDto,
		nullable: true,
		description:
			'The most recent message sent in the room, if any exist yet',
	})
	@Expose()
	@Type(() => ChatMessageListItemResponseDto)
	lastMessage!: ChatMessageListItemResponseDto | null;

	@ApiPropertyOptional({
		type: ChatRoomMemberDto,
		description:
			'The other participant in the conversation. Only present when type is DIRECT',
	})
	@Expose()
	@Type(() => ChatRoomMemberDto)
	otherMember?: ChatRoomMemberDto;

	@ApiPropertyOptional({
		type: [ChatRoomMemberDto],
		description:
			'Preview of up to 5 members (excluding the current user). Only present when type is GROUP',
	})
	@Expose()
	@Type(() => ChatRoomMemberDto)
	membersPreview?: ChatRoomMemberDto[];

	@ApiPropertyOptional({
		type: [String],
		format: 'uuid',
		description:
			'IDs of all members in the room (excluding the current user). Only present when type is GROUP',
	})
	@Expose()
	memberIds?: string[];

	@ApiPropertyOptional({
		type: Number,
		description:
			'Total number of members in the room (excluding the current user). Only present when type is GROUP',
	})
	@Expose()
	@Transform(
		({ obj }: { obj: { memberIds?: string[] } }) => obj.memberIds?.length,
	)
	memberCount?: number;
}
