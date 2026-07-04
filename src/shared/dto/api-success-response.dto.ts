import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApiSuccessResponseDto<T> {
	@ApiProperty({ example: 'success', enum: ['success'] })
	status!: 'success';

	@ApiProperty({ required: false })
	message?: string;

	@ApiProperty({ required: true })
	@Type(() => Object)
	data?: T;
}
