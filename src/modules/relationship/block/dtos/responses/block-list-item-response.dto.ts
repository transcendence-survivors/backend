import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BlockListItemResponseDto {
	@ApiProperty({
		description: 'The unique identifier for the block relationship',
		format: 'uuid',
		type: String,
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'The date when the block was created',
		type: Date,
	})
	@Expose()
	since!: Date;

	@ApiProperty({
		description: 'The user who is blocked',
		type: UserListItemResponseDto,
	})
	@Expose()
	blocked!: UserListItemResponseDto;
}
