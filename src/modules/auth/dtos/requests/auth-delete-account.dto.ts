import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthDeleteAccountDto {
	@ApiProperty({
		description: 'Current user password to confirm account deletion',
		example: 'CurrentP@ssw0rd123',
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	password!: string;
}
