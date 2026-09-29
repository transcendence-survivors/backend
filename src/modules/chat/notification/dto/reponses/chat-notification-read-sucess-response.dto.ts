import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatNotificationReadSuccessResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID of the chat room that was marked as read',
		example: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
	})
	@Expose()
	roomId!: string;

	@ApiProperty({
		type: String,
		format: 'iso-date-time',
		description: 'Timestamp when the room was marked as read',
		example: '2026-09-22T14:38:15.000Z',
	})
	@Expose()
	readAt!: Date;
}
