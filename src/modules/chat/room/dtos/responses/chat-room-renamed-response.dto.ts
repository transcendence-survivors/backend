import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatRoomRenamedResponseDto {
	@ApiProperty({ description: 'ID of the chat room', example: 'room_123' })
	@Expose()
	roomId!: string;

	@ApiProperty({
		description: 'New name of the room',
		example: 'General Discussion',
	})
	@Expose()
	newName!: string;
}
