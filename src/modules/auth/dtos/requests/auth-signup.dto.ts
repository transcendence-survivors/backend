import { IsBio } from '@/shared/validators/fields/user/is-bio';
import { IsDisplayName } from '@/shared/validators/fields/user/is-display-name';
import { LocalePreference, UserGender } from '@prisma-generated/client';
import { IsLocalePreference } from '@/shared/validators/fields/user/is-locale-preference';
import { IsBirthDate } from '@/shared/validators/fields/user/is-birth-date';
import { IsLastName } from '@/shared/validators/fields/user/is-last-name';
import { IsFirstName } from '@/shared/validators/fields/user/is-first-name';
import { IsGender } from '@/shared/validators/fields/user/is-gender';
import { IsUsername } from '@/shared/validators/fields/user/is-username';
import { IsEmail } from '@/shared/validators/fields/user/is-email';
import { IsPassword } from '@/shared/validators/fields/user/is-password';
import { ApiProperty } from '@nestjs/swagger';

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
