import {
	IsArray,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
	MaxLength,
} from 'class-validator';

export class ChatMessageCreateDto {
	@IsUUID()
	roomId!: string;

	@IsOptional()
	@IsString()
	@MaxLength(4000)
	content?: string;

	@IsOptional()
	@IsArray()
	@IsUrl({}, { each: true })
	attachmentUrls?: string[];

	@IsOptional()
	@IsUUID()
	replyToId?: string;
}
