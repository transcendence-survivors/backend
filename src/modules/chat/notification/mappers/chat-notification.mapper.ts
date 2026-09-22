import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChatNotificationUnreadCountResponseDto } from '../dto/reponses/chat-notification-unread-count-response.dto';
import { ChatNotificationReadSuccessResponseDto } from '../dto/reponses/chat-notification-read-sucess-response.dto';
import { ChatNotificationNewDto } from '../dto/reponses/chat-notification-new-response.dto';

@Injectable()
export class ChatNotificationMapper {
	toRoomReadSuccessDto(
		roomId: string,
		readAt: Date = new Date(),
	): ChatNotificationReadSuccessResponseDto {
		return plainToInstance(
			ChatNotificationReadSuccessResponseDto,
			{
				roomId,
				readAt,
			},
			{ excludeExtraneousValues: true },
		);
	}

	toUnreadCountResponseDto(
		totalUnreadCount: number,
	): ChatNotificationUnreadCountResponseDto {
		return plainToInstance(
			ChatNotificationUnreadCountResponseDto,
			{ totalUnreadCount },
			{ excludeExtraneousValues: true },
		);
	}

	toNotificationNewDto(roomId: string): ChatNotificationNewDto {
		return plainToInstance(
			ChatNotificationNewDto,
			{ roomId },
			{ excludeExtraneousValues: true },
		);
	}
}
