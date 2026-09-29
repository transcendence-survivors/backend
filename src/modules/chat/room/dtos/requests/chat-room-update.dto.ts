import { ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsOptional,
	IsString,
	IsUrl,
	Length,
	ValidateIf,
} from 'class-validator';

export class ChatRoomUpdateDto {
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description:
			'New name of the chat room. Pass null to remove the custom name.',
		example: 'Updated Room Name',
	})
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@IsString()
	@Length(1, 100)
	name?: string | null;

	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description:
			'New avatar URL of the chat room. Pass null to remove avatar.',
		example: 'https://cdn.example.com/rooms/updated-avatar.png',
	})
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@IsUrl({ require_tld: false })
	avatarUrl?: string | null;
}
