import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsArray,
	IsOptional,
	IsString,
	IsUUID,
	ArrayMinSize,
	MaxLength,
	ArrayMaxSize,
} from 'class-validator';

export class ChatMessageSharePostDto {
	@ApiProperty({
		description: 'The unique identifier of the post being shared',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsUUID()
	postId!: string;

	@ApiProperty({
		description: 'List of target chat room IDs to share the post to',
		example: [
			'987e6543-e89b-12d3-a456-426614174000',
			'456e7890-e89b-12d3-a456-426614174000',
		],
		type: [String],
	})
	@IsArray()
	@ArrayMinSize(1, {
		message: 'At least one target room ID must be provided',
	})
	@ArrayMaxSize(1000, {
		message: 'No more than 1000 target room IDs can be provided',
	})
	@IsUUID('all', { each: true, message: 'Each room ID must be a valid UUID' })
	roomIds!: string[];

	@ApiPropertyOptional({
		description: 'Optional commentary attached to the shared post',
		example: 'Check out this awesome post!',
		maxLength: 2000,
	})
	@IsOptional()
	@IsString()
	@MaxLength(2000, { message: 'Comment cannot exceed 2000 characters' })
	comment?: string;
}
