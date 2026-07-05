import { UserListItemResponseDto } from '@/modules/user/dto/response/user-list-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendshipState } from '@prisma-generated/enums';
import { Exclude } from 'class-transformer';

@Exclude()
export class FriendShipListItemResponseDto {
	@ApiProperty({ type: String, format: 'uuid' })
	id!: string;

	@ApiProperty({ enum: FriendshipState })
	status!: FriendshipState;

	@ApiProperty({ type: Date })
	since!: Date;

	@ApiProperty()
	friend!: UserListItemResponseDto;
}
