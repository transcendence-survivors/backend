import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
	@ApiProperty({ example: 'error', enum: ['error'] })
	status!: 'error';

	@ApiProperty({ example: 'Validation failed' })
	message!: string;

	@ApiProperty({ required: false, example: 'user.email.invalid' })
	messageKey?: string;

	@ApiProperty({ example: 400 })
	code!: number;

	@ApiProperty({
		nullable: true,
		type: 'object',
		additionalProperties: true,
		example: { email: ['email must be a valid email'] },
	})
	errors!: Record<string, unknown> | null;
}
