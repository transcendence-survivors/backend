import { IsString, IsUUID, MaxLength } from 'class-validator';

export class ChatMessageEditDto {
	@IsUUID()
	roomId!: string;

	@IsUUID()
	messageId!: string;

	@IsString()
	@MaxLength(4000)
	content?: string;
}
