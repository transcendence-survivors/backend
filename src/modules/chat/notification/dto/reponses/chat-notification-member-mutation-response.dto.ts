import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChatNotificationMemberMutationEnum } from '../../types/enums/chat-notification-member-mutation.enum';

@Exclude()
export class ChatNotificationMemberMutationResponseDto {
	@ApiProperty({
		description: "L'identifiant unique du salon de discussion",
		example: 'd9b2b3b4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
	})
	@Expose()
	roomId!: string;

	@ApiProperty({
		description: 'Le type de modification apportée au membre',
		enum: ChatNotificationMemberMutationEnum,
		example: ChatNotificationMemberMutationEnum.ROLE_UPDATE,
	})
	@Expose()
	type!: ChatNotificationMemberMutationEnum;

	@ApiProperty({
		description: "L'identifiant unique de l'utilisateur concerné",
		example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
	})
	@Expose()
	userId!: string;
}
