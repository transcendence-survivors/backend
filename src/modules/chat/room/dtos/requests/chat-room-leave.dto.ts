import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRoomLeaveDto {
	@ApiProperty({
		description: 'ID of the chat room to leave',
		example: 'room_123',
	})
	@IsString()
	@IsNotEmpty()
	roomId!: string;
}
