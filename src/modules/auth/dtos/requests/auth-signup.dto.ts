import {
	IsBio,
	IsBirthDate,
	IsDisplayName,
	IsEmail,
	IsFirstName,
	IsGender,
	IsLastName,
	IsLocalePreference,
	IsPassword,
	IsUsername,
} from '@/shared/validators/fields/users';
import { ApiProperty } from '@nestjs/swagger';
import { LocalePreference, UserGender } from '@prisma-generated/enums';

export class AuthSignUpDto {
	@ApiProperty({
		description: 'The email address of the user',
		example: 'user@example.com',
		format: 'email',
		type: String,
	})
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'The username of the user',
		example: 'john_doe',
		type: String,
	})
	@IsUsername()
	username!: string;

	@ApiProperty({
		description: 'The gender of the user',
		enum: UserGender,
		example: UserGender.MALE,
	})
	@IsGender()
	gender!: UserGender;

	@ApiProperty({
		description: 'The first name of the user',
		example: 'John',
		type: String,
	})
	@IsFirstName()
	firstName!: string;

	@ApiProperty({
		description: 'The last name of the user',
		example: 'Doe',
		type: String,
	})
	@IsLastName()
	lastName!: string;

	@ApiProperty({
		description: 'The date of birth of the user',
		example: '1990-01-01',
		type: String,
		format: 'date',
	})
	@IsBirthDate()
	dateOfBirth!: Date;

	@ApiProperty({
		description: 'The preferred locale of the user',
		example: LocalePreference.EN,
		enum: LocalePreference,
	})
	@IsLocalePreference()
	localePreference!: LocalePreference;

	@ApiProperty({
		description: 'The display name of the user',
		example: 'John Doe',
		type: String,
	})
	@IsDisplayName()
	displayName!: string;

	@ApiProperty({
		description: 'The bio of the user',
		example: 'Hello, I am John Doe!',
		type: String,
	})
	@IsBio()
	bio!: string;

	@ApiProperty({
		description: 'The password of the user',
		example: 'SecurePassword123!',
		format: 'password',
		type: String,
	})
	@IsPassword()
	password!: string;
}
