import { IsPassword } from '@/shared/validators/fields/user/is-password';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString, MaxLength } from 'class-validator';

export class AuthResetPasswordDto {
	@ApiProperty({
		description: 'The token sent to the user for password reset',
		example: 'reset-token-123456',
		type: String,
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	token!: string;

	@ApiProperty({
		description: 'The new password for the user',
		example: 'NewSecurePassword123!',
		format: 'password',
		type: String,
	})
	@IsPassword()
	newPassword!: string;
}
