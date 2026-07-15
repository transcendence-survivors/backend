import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from '@prisma-generated/enums';
import { IsArray, IsEnum, IsString, ValidateIf } from 'class-validator';
import { ValidUserIdsForRoomType } from '../../validators';

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
	@ValidUserIdsForRoomType()
	usersIds!: string[];
}
