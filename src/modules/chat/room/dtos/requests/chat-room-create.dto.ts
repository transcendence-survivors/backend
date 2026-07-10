import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from '@prisma-generated/enums';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsString,
	ValidateIf,
} from 'class-validator';

export class ChatRoomCreateDto {
	@ApiProperty({
		description: 'The type of the chat room: either "GROUP" or "DIRECT"',
		enum: ChatRoomType,
		example: ChatRoomType.GROUP,
	})
	@IsEnum(ChatRoomType)
	type: ChatRoomType = ChatRoomType.GROUP;

	@ValidateIf((o: ChatRoomCreateDto) => o.type === ChatRoomType.GROUP)
	@IsString()
	@ApiProperty({
		description: 'The name of the chat room',
		example: 'My Group Chat',
	})
	name!: string;

	@ApiProperty({
		description: 'The list of user IDs to invite to the chat room',
		example: ['uuid1', 'uuid2'],
	})
	@IsArray()
	@IsString({ each: true })
	@ValidateIf((o: ChatRoomCreateDto) => o.type === ChatRoomType.DIRECT)
	@ArrayMinSize(1, {
		message: 'Direct chats must have exactly one recipient.',
	})
	@ArrayMaxSize(1, {
		message: 'Direct chats must have exactly one recipient.',
	})
	@ValidateIf((o: ChatRoomCreateDto) => o.type === ChatRoomType.GROUP)
	@ArrayMinSize(1, {
		message: 'You must invite at least one user to a group chat room.',
	})
	userIds!: string[];
}
