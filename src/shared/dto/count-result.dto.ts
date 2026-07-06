import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CountResponseDto {
	@ApiProperty({
		description: 'The total count of items',
		example: 42,
		type: Number,
	})
	@Expose()
	count!: number;
}
