import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendshipState } from '@prisma-generated/enums';
import { Exclude } from 'class-transformer';

@Exclude()
export class FriendShipListItemResponseDto {
	@ApiProperty({
		description: 'The unique identifier for the friendship',
		format: 'uuid',
		type: String,
	})
	id!: string;

	@ApiProperty({
		description: 'The state of the friendship',
		enum: FriendshipState,
	})
	status!: FriendshipState;

	@ApiProperty({
		description: 'The date when the friendship was created',
		type: Date,
	})
	since!: Date;

	@ApiProperty({
		type: UserListItemResponseDto,
		description: 'The friend involved in the friendship',
	})
	friend!: UserListItemResponseDto;
}
