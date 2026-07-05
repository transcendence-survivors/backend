import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserListItemResponseDto {
	@ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
	@Expose()
	id!: string;

	@ApiProperty({ example: 'johndoe' })
	@Expose()
	username!: string;

	@ApiProperty({ example: 'John Doe' })
	@Expose()
	displayName!: string;

	@ApiProperty({
		nullable: true,
		type: String,
		example: 'https://example.com/avatar.jpg',
	})
	@Expose()
	avatarUrl!: string | null;
}
