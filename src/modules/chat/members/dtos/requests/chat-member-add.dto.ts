import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class ChatMembersAddDto {
	@ApiProperty({
		type: [String],
		description: 'Array of user IDs to add to the room',
	})
	@IsArray()
	@IsUUID('4', { each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(10000)
	userIds!: string[];
}
