import { IsPassword } from '@/modules/user/user.decorators';
import { MinLength, IsString, MaxLength } from 'class-validator';

export class ResetPasswordDto {
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	token!: string;

	@IsPassword()
	newPassword!: string;
}
