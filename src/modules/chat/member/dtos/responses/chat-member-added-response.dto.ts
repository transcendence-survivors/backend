import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatMemberAddedResponseDto {
	@ApiProperty({ description: 'ID of the chat room', example: 'room_123' })
	@Expose()
	roomId!: string;

	@ApiProperty({ description: 'ID of the added user', example: 'user_456' })
	@Expose()
	userId!: string;
}
