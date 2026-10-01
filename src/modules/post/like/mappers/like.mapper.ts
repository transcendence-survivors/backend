import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LikeInfoResponseDto } from '../dtos/responses/like-info-response.dto';

@Injectable()
export class LikeMapper {
	toInfoDto(count: number, isLiked: boolean): LikeInfoResponseDto {
		return plainToInstance(
			LikeInfoResponseDto,
			{ count, isLiked },
			{ excludeExtraneousValues: true },
		);
	}
}
