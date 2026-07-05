import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserGender } from '@prisma-generated/enums';
import { UserListItemResponseDto } from './user-list-item-response.dto';

export class UserProfileResponseDto extends UserListItemResponseDto {
	@ApiProperty({ example: 'johndoe@example.com' })
	@Expose()
	email!: string;

	@ApiProperty({ enum: UserGender, example: UserGender.MALE })
	@Expose()
	gender!: UserGender;

	@ApiProperty({ example: 'John' })
	@Expose()
	firstName!: string;

	@ApiProperty({ example: 'Doe' })
	@Expose()
	lastName!: string;

	@ApiProperty({ nullable: true, type: String, example: 'Software Engineer' })
	@Expose()
	bio!: string | null;
}
