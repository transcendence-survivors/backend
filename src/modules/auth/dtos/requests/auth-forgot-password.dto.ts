import { IsEmail } from '@/shared/validators/fields/users';
import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotPasswordDto {
	@ApiProperty({
		description: 'The email address of the user who forgot their password',
		example: 'user@example.com',
		format: 'email',
		type: String,
	})
	@IsEmail()
	email!: string;
}
