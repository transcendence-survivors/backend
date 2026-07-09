import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma-generated/enums';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUserResponseDto {
	@ApiProperty({
		description: 'The unique identifier of the user',
		example: '123e4567-e89b-12d3-a456-426614174000',
		format: 'uuid',
		type: String,
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'The username of the user',
		example: 'john_doe',
		type: String,
	})
	@Expose()
	username!: string;

	@ApiProperty({
		description: 'The display name of the user',
		example: 'John Doe',
		type: String,
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		description: 'The avatar URL of the user',
		example: 'https://example.com/avatar.jpg',
		type: String,
		required: false,
	})
	@Expose()
	avatarUrl?: string;

	@ApiProperty({
		description: 'The role of the user',
		example: UserRole.USER,
		enum: UserRole,
	})
	@Expose()
	role!: UserRole;
}
