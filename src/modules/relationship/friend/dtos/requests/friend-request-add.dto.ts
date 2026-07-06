import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class FriendRequestAddDto {
	@ApiProperty({
		description: 'The UUID of the user to send a friend request to',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsUUID()
	friendId!: string;
}

export { FriendRequestAddDto };
