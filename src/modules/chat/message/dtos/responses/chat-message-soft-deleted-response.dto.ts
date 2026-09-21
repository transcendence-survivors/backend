import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatMessageSoftDeletedResponseDto {
	@ApiProperty({
		description: 'ID of the deleted message',
		example: 'msg_123',
	})
	@Expose()
	messageId!: string;

	@ApiProperty({ description: 'ID of the chat room', example: 'room_456' })
	@Expose()
	roomId!: string;
}
