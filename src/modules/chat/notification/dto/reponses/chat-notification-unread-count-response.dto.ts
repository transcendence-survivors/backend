import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatNotificationUnreadCountResponseDto {
	@ApiProperty({
		type: Number,
		description:
			'Total number of unread messages across all joined chat rooms',
		example: 5,
		default: 0,
	})
	@Expose()
	totalUnreadCount!: number;
}
