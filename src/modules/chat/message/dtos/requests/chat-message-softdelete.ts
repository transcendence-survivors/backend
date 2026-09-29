import { IsUUID } from 'class-validator';

export class ChatMessageSoftDeleteDto {
	@IsUUID()
	messageId!: string;
}
