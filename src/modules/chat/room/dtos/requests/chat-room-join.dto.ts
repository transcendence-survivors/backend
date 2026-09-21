import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRoomJoinDto {
	@ApiProperty({
		description: 'ID of the chat room to join',
		example: 'room_123',
	})
	@IsString()
	@IsNotEmpty()
	roomId!: string;
}
