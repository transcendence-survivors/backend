import { UserListItem } from '@/modules/user/user.public-api';
import { Injectable } from '@nestjs/common';
import { PresenceConnectedResponseDto } from '../dtos/responses/presence-connected-response.dto';
import { plainToInstance } from 'class-transformer';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { PresenceUpdatedResponseDto } from '../dtos/responses/presence-updated-response.dto';
import { PresenceCountResponseDto } from '../dtos/responses/presence-count-response.dto';
import { PresenceInitialStatusResponseDto } from '../dtos/responses/presence-initial-status-response.dto';
import { PresenceInitialFriendsResponseDto } from '../dtos/responses/presence-initial-friends-response.dto';

@Injectable()
export class PresenceMapper {
	toConnectedDto(
		user: UserListItem,
		status: PresenceStatusEnum,
	): PresenceConnectedResponseDto {
		return plainToInstance(
			PresenceConnectedResponseDto,
			{
				id: user.id,
				username: user.username,
				displayName: user.displayName,
				avatarUrl: user.avatarUrl,
				status: status,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toUpdatedDto(
		userId: string,
		status: PresenceStatusEnum,
	): PresenceUpdatedResponseDto {
		return plainToInstance(
			PresenceUpdatedResponseDto,
			{
				id: userId,
				status: status,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toCountDto(count: number): PresenceCountResponseDto {
		return plainToInstance(
			PresenceCountResponseDto,
			{ count },
			{ excludeExtraneousValues: true },
		);
	}

	toInitialStatusDto(
		userId: string,
		status: PresenceStatusEnum,
	): PresenceInitialStatusResponseDto {
		return plainToInstance(
			PresenceInitialStatusResponseDto,
			{
				id: userId,
				status: status,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toInitialFriendsDto(
		friends: PresenceInitialStatusResponseDto[],
	): PresenceInitialFriendsResponseDto {
		return plainToInstance(
			PresenceInitialFriendsResponseDto,
			{
				friends: friends,
			},
			{ excludeExtraneousValues: true },
		);
	}
}
