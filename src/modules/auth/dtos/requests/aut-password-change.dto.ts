import { IsPassword } from '@/shared/validators/fields/users';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthPasswordChangeDto {
	@ApiProperty({
		description: 'Current user password',
		example: 'CurrentP@ssw0rd123',
	})
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;

	@ApiProperty({
		description: 'New password (minimum 8 characters)',
		example: 'NewP@ssw0rd2026',
		minLength: 8,
	})
	@IsPassword()
	newPassword!: string;
}
