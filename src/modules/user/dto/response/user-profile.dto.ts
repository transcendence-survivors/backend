import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserGender } from '@prisma-generated/enums';
import { UserListItemResponseDto } from './user-list-item-response.dto';

export class UserProfileResponseDto extends UserListItemResponseDto {
	@ApiProperty()
	@Expose()
	email!: string;

	@ApiProperty({ enum: UserGender })
	@Expose()
	gender!: UserGender;

	@ApiProperty()
	@Expose()
	firstName!: string;

	@ApiProperty()
	@Expose()
	lastName!: string;

	@ApiProperty({ nullable: true, type: String })
	@Expose()
	bio!: string | null;
}
