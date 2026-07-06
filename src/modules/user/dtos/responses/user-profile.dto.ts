import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserListItemResponseDto } from './user-list-item-response.dto';

export class UserProfileResponseDto extends UserListItemResponseDto {
	@ApiProperty({
		description: "The URL of the user's cover image",
		example: 'https://example.com/cover.jpg',
		type: String,
		nullable: true,
	})
	@Expose()
	coverImageUrl!: string | null;

	@ApiProperty({
		description: "The user's bio",
		example: 'Software Engineer',
		type: String,
		nullable: true,
	})
	@Expose()
	bio!: string | null;
}
