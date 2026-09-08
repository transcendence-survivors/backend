import { ApiProperty } from '@nestjs/swagger';
import { ChatMemberRole } from '@prisma-generated/enums';
import { IsEnum } from 'class-validator';

export class ChatMemberUpdateRoleDto {
	@ApiProperty({
		description: 'The new role for the chat member',
		enum: ChatMemberRole,
		example: ChatMemberRole.ADMIN,
	})
	@IsEnum(ChatMemberRole, {
		message: 'Role must be a valid ChatMemberRole (ADMIN or MEMBER)',
	})
	role!: ChatMemberRole;
}
