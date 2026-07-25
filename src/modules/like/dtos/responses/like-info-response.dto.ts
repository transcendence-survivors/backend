import { CountResponseDto } from '@/shared/dto/count-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LikeInfoResponseDto extends CountResponseDto {
	@ApiProperty({
		type: Boolean,
		description: 'Whether the current user liked the post',
		example: true,
	})
	@Expose()
	isLiked!: boolean;
}
