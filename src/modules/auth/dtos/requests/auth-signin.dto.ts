import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSignInDto {
	@ApiProperty({
		description: 'The username or email of the user',
		example: 'john_doe or john.doe@example.com',
		type: String,
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	usernameOrEmail!: string;

	@ApiProperty({
		description: 'The password of the user',
		example: 'SecurePassword123!',
		format: 'password',
		type: String,
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	password!: string;
}
