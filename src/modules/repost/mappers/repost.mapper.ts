import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RepostInfoResponseDto } from '../dtos/responses/repost-info-response.dto';

@Injectable()
export class RepostMapper {
	toInfoDto(count: number, isReposted: boolean): RepostInfoResponseDto {
		return plainToInstance(
			RepostInfoResponseDto,
			{ count, isReposted },
			{ excludeExtraneousValues: true },
		);
	}
}
