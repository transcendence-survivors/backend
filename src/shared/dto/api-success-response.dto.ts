import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApiSuccessResponseDto<T> {
	@ApiProperty({ example: 'success', enum: ['success'] })
	status!: 'success';

	@ApiProperty({
		example: 'Entity created successfully',
		required: false,
		type: String,
	})
	message?: string;

	@ApiProperty({
		example: { id: 1, name: 'John Doe' },
		required: false,
		type: Object,
	})
	@Type(() => Object)
	data?: T;
}
