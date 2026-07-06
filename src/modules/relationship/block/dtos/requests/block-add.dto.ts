import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class BlockAddDto {
	@ApiProperty({
		description: 'The UUID of the user to block',
		example: '123e4567-e89b-12d3-a456-426614174000',
		format: 'uuid',
		type: String,
	})
	@IsUUID()
	blockedId!: string;
}

export { BlockAddDto };
