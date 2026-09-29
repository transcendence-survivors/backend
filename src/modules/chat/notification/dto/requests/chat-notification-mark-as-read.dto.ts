import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChatNotificationMarkAsReadDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID of the chat room to mark as read',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@IsUUID()
	roomId!: string;
}
