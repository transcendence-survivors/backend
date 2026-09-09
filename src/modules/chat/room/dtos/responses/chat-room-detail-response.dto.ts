import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomListItemResponseDto } from './chat-room-list-item-response.dto';
import { ChatMemberRole } from '@prisma-generated/enums';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatRoomDetailResponseDto extends ChatRoomListItemResponseDto {
	@Expose()
	@ApiProperty({ enum: ChatMemberRole, example: ChatMemberRole.OWNER })
	currentUserRole!: ChatMemberRole;
}
