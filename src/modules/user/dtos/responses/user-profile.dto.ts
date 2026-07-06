import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserGender } from '@prisma-generated/enums';
import { UserListItemResponseDto } from './user-list-item-response.dto';

export class UserProfileResponseDto extends UserListItemResponseDto {
	@ApiProperty({
		example: 'johndoe@example.com',
		description: "The user's email address",
		type: String,
	})
	@Expose()
	email!: string;

	@ApiProperty({
		description: "The user's gender",
		enum: UserGender,
		example: UserGender.MALE,
	})
	@Expose()
	gender!: UserGender;

	@ApiProperty({
		description: "The user's first name",
		example: 'John',
		type: String,
	})
	@Expose()
	firstName!: string;

	@ApiProperty({
		description: "The user's last name",
		example: 'Doe',
		type: String,
	})
	@Expose()
	lastName!: string;

	@ApiProperty({
		description: "The user's bio",
		example: 'Software Engineer',
		type: String,
		nullable: true,
	})
	@Expose()
	bio!: string | null;
}
