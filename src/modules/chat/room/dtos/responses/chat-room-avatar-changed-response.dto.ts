import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatRoomAvatarChangedResponseDto {
	@ApiProperty({ description: 'ID of the chat room', example: 'room_123' })
	@Expose()
	roomId!: string;

	@ApiPropertyOptional({
		description: 'URL of the new room avatar or null if removed',
		nullable: true,
		example: 'https://cdn.example.com/avatars/room_123.png',
	})
	@Expose()
	newAvatarUrl!: string | null;
}
