import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocalePreference, UserGender } from '@prisma-generated/enums';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSettingsResponseDto {
	@Expose()
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'Unique user UUID v4 identifier',
		example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
	})
	id!: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: 'Unique username used for mentions and profile URL',
		example: 'johndoe',
	})
	username!: string;

	@Expose()
	@ApiProperty({
		type: String,
		format: 'email',
		description: "User's email address",
		example: 'john.doe@example.com',
	})
	email!: string;

	@Expose()
	@ApiProperty({
		enum: UserGender,
		enumName: 'UserGender',
		description: "User's gender",
		example: UserGender.MALE,
	})
	gender!: UserGender;

	@Expose()
	@ApiProperty({
		type: String,
		description: "User's first name",
		example: 'John',
	})
	firstName!: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: "User's last name",
		example: 'Doe',
	})
	lastName!: string;

	@Expose()
	@ApiProperty({
		type: String,
		format: 'date-time',
		description: "User's birth date",
		example: '1995-12-17T00:00:00.000Z',
	})
	birthDate!: Date;

	@Expose()
	@ApiProperty({
		type: String,
		description: "User's public display name",
		example: 'John Doe',
	})
	displayName!: string;

	@Expose()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'Short bio or self-description of the user',
		example: 'Fullstack Developer & NestJS enthusiast',
	})
	bio?: string | null;

	@Expose()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: "URL of the user's avatar image",
		example: 'https://cdn.example.com/avatars/user_1.jpg',
	})
	avatarUrl?: string | null;

	@Expose()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: "URL of the user's profile cover banner image",
		example: 'https://cdn.example.com/covers/cover_1.jpg',
	})
	coverImageUrl?: string | null;

	@Expose()
	@ApiProperty({
		enum: LocalePreference,
		enumName: 'LocalePreference',
		default: LocalePreference.EN,
		description: 'User interface locale preference',
	})
	localePreference!: LocalePreference;

	@Expose()
	@ApiProperty({
		type: String,
		format: 'date-time',
		description: 'Account creation date and time',
		example: '2024-01-15T10:30:00.000Z',
	})
	createdAt!: Date;
}
