import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChatMemberRole } from '@prisma-generated/client';

@Exclude()
export class ChatMemberRoleUpdatedResponseDto {
	@ApiProperty({ description: 'ID of the chat room', example: 'room_123' })
	@Expose()
	roomId!: string;

	@ApiProperty({ description: 'ID of the target user', example: 'user_456' })
	@Expose()
	targetUserId!: string;

	@ApiProperty({ enum: ChatMemberRole, description: 'Newly assigned role' })
	@Expose()
	newRole!: ChatMemberRole;
}
