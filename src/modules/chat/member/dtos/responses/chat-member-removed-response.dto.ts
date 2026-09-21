import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatMemberRemovedResponseDto {
	@ApiProperty({ description: 'id of the chat room', example: 'room_123' })
	@Expose()
	roomId!: string;

	@ApiProperty({
		description: 'ID of the user removed',
		example: 'user_456',
	})
	@Expose()
	userId!: string;
}
