import { IsUUID } from 'class-validator';

export class ChatRoomDirectCreateDto {
	@IsUUID()
	targetUserId!: string;
}
