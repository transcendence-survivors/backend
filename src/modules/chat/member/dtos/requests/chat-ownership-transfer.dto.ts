import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChatOwnershipTransferDto {
	@ApiProperty({
		type: String,
		description: 'User ID of the new room owner',
		example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	targetUserId!: string;
}
