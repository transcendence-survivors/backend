import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatMessageSharePostResponseDto {
	@ApiProperty({
		description: 'The unique identifier of the shared post',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@Expose()
	postId!: string;

	@ApiProperty({
		description: 'Array of room IDs where the post was successfully shared',
		example: ['987e6543-e89b-12d3-a456-426614174000'],
		type: [String],
	})
	@Expose()
	successfulRoomIds!: string[];

	@ApiProperty({
		description: 'Array of room IDs where the share action failed',
		example: ['456e7890-e89b-12d3-a456-426614174000'],
		type: [String],
	})
	@Expose()
	failedRoomIds!: string[];
}
