import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class ChatRoomUpdateDto {
	@ApiPropertyOptional({
		type: String,
		description: 'New name of the chat room',
		example: 'Updated Room Name',
	})
	@IsOptional()
	@IsString()
	@Length(1, 100)
	name?: string;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'New avatar URL of the chat room',
		example: 'https://cdn.example.com/rooms/updated-avatar.png',
	})
	@IsOptional()
	@IsUrl()
	avatarUrl?: string;
}
