import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatTypingUpdateResponseDto {
	@ApiProperty({ description: 'ID of the chat room', example: 'room_456' })
	@Expose()
	roomId!: string;

	@ApiProperty({
		description: 'ID of the user who is typing',
		example: 'user_789',
	})
	@Expose()
	userId!: string;

	@ApiProperty({
		description: 'Display name of the user who is typing',
		example: 'John Doe',
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		description: 'Whether the user is currently typing',
		example: true,
	})
	@Expose()
	isTyping!: boolean;
}
