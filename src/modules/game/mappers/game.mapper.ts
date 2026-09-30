import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserGameSummaryResponseDto } from '../dtos/responses/user-game-summary-response.dto';
import { UserSummaryWithWeapons } from '../types/records/user-summary-with-weapons.type';

@Injectable()
export class GameMapper {
	toUserSummaryResponseDto(
		summary: UserSummaryWithWeapons,
	): UserGameSummaryResponseDto {
		return plainToInstance(UserGameSummaryResponseDto, summary, {
			excludeExtraneousValues: true,
		});
	}
}
