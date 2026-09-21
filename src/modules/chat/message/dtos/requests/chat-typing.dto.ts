import { IsUUID } from 'class-validator';

export class ChatTypingDto {
	@IsUUID()
	roomId!: string;
}
