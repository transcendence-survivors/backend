import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatNotificationNewDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID of the chat room that was marked as read',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	roomId!: string;
}
