import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';
import {
	IsBio,
	IsBirthDate,
	IsDisplayName,
	IsFirstName,
	IsGender,
	IsLastName,
	IsLocalePreference,
} from '@/shared/validators/fields/users';
import { LocalePreference, UserGender } from '@prisma-generated/enums';

export class UserSettingsPatchDto {
	@ApiPropertyOptional({
		description: 'The gender of the user',
		enum: UserGender,
		example: UserGender.MALE,
	})
	@IsOptional()
	@IsGender()
	gender?: UserGender;

	@ApiPropertyOptional({
		description: 'The first name of the user',
		example: 'John',
		type: String,
	})
	@IsOptional()
	@IsFirstName()
	firstName?: string;

	@ApiPropertyOptional({
		description: 'The last name of the user',
		example: 'Doe',
		type: String,
	})
	@IsOptional()
	@IsLastName()
	lastName?: string;

	@ApiPropertyOptional({
		description: 'The date of birth of the user',
		example: '1990-01-01',
		type: String,
		format: 'date',
	})
	@IsOptional()
	@IsBirthDate()
	birthDate?: Date;

	@ApiPropertyOptional({
		description: 'The display name of the user',
		example: 'John Doe',
		type: String,
	})
	@IsOptional()
	@IsDisplayName()
	displayName?: string;

	@ApiPropertyOptional({
		description: 'The bio of the user',
		example: 'Hello, I am John Doe!',
		type: String,
	})
	@IsOptional()
	@IsBio()
	bio?: string;

	@ApiPropertyOptional({
		description: 'The preferred locale of the user',
		example: LocalePreference.EN,
		enum: LocalePreference,
	})
	@IsOptional()
	@IsLocalePreference()
	localePreference?: LocalePreference;

	@ApiPropertyOptional({
		description: 'The avatar URL of the user (or null to remove)',
		example: 'https://s3.amazonaws.com/bucket/avatars/user-123.jpg',
		type: String,
		nullable: true,
	})
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@IsUrl({ require_tld: false })
	avatarUrl?: string | null;

	@ApiPropertyOptional({
		description: 'The cover image URL of the user (or null to remove)',
		example: 'https://s3.amazonaws.com/bucket/covers/user-123.jpg',
		type: String,
		nullable: true,
	})
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@IsUrl({ require_tld: false })
	coverImageUrl?: string | null;
}
