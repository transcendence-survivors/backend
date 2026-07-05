import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CountResponseDto {
	@ApiProperty()
	@Expose()
	count!: number;
}
