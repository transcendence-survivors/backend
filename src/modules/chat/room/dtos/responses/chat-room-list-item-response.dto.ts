import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class ChatRoomListItemResponseDto {
	@ApiProperty({
		description: 'The unique identifier of the chat room',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		format: 'uuid',
	})
	id!: string;

	@ApiProperty({
		description: 'The name of the chat room',
		example: 'General Chat',
		type: String,
	})
	name!: string;

	@ApiProperty({
		description: 'The timestamp when the chat room was created',
		example: '2023-01-01T00:00:00Z',
		type: Date,
	})
	createdAt!: Date;

	@ApiProperty({
		description: 'The timestamp when the chat room was last updated',
		example: '2023-01-02T00:00:00Z',
		type: Date,
	})
	updatedAt!: Date;
}
