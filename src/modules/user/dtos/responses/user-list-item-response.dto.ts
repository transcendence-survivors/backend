import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserListItemResponseDto {
	@ApiProperty({
		description: "The user's unique identifier",
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "The user's username",
		example: 'johndoe',
		type: String,
	})
	@Expose()
	username!: string;

	@ApiProperty({
		description: "The user's display name",
		example: 'John Doe',
		type: String,
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		description: "The user's avatar URL",
		nullable: true,
		type: String,
		example: 'https://example.com/avatar.jpg',
	})
	@Expose()
	avatarUrl!: string | null;
}
